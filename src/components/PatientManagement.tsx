import { useEffect, useState } from "react";
import app from "../firebaseConfig";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

const database = getDatabase(app);

interface Patient {
  qtdDoses: number;
  imunizacaoCompleta: boolean;
  personID: string;
}

interface Person {
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  email: string;
  contact: string;
  addressId: string;
}

function PatientManagement() {
  const [patient, setPatient] = useState<Record<string, Patient>>({});
  const [person, setPerson] = useState<Record<string, Person>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all patients
    const patientsRef = ref(database, "pacients");
    const unsubscribePatient = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPatient(data);
        setLoading2(false);
      }
    });

    // Fetch all persons
    const personRef = ref(database, "persons");
    const unsubscribePerson = onValue(personRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPerson(data);
        setLoading(false);
      }
    });

    return () => {
      unsubscribePatient();
      unsubscribePerson();
    };
  }, []);

  const handleEdit = (id: string) => {
    const patientToEdit = patient[id];
    setEditId(id);
    setEditData(patientToEdit);
  };

  const handleRemove = (id: string) => {
    const patientRef = ref(database, `pacients/${id}`);
    remove(patientRef).then(() => {
      const newPatient = { ...patient };
      delete newPatient[id];
      setPatient(newPatient);
    });
  };

  const handleSave = () => {
    if (editId && editData) {
      const patientRef = ref(database, `pacients/${editId}`);
      update(patientRef, editData).then(() => {
        setPatient({
          ...patient,
          [editId]: { ...patient[editId], ...editData },
        });
        setEditId(null);
        setEditData({});
      });
    }
  };

  if (loading || loading2) {
    return (
      <Container fluid className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <h3 className="centered-header">Patients</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>CPF</th>
                  <th>RG</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>qtdDoses</th>
                  <th>Immunization Complete?</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(patient).map(([key, patient]) => {
                  const persons = person[patient.personID];

                  return (
                    <tr key={key}>
                      <td>{persons ? persons.name : "N/A"}</td>
                      <td>{persons ? persons.surname : "N/A"}</td>
                      <td>{persons ? persons.cpf : "N/A"}</td>
                      <td>{persons ? persons.rg : "N/A"}</td>
                      <td>{persons ? persons.email : "N/A"}</td>
                      <td>{persons ? persons.contact : "N/A"}</td>
                      <td>{patient.qtdDoses}</td>
                      <td>{String(patient.imunizacaoCompleta)}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEdit(key)}
                          className="w-100"
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(key)}
                          className="w-100"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        {editId && (
          <Row className="justify-content-md-center">
            <Col xs={12} md={6} className="bordered-form">
              <p className="initial" />
              <h5>Edit Patient</h5>
              <Form>
                <Form.Group className="mb-1">
                  <Form.Label>Quantity of Doses</Form.Label>
                  <Form.Control
                    type="number"
                    value={editData.qtdDoses || 0}
                    onChange={(e) =>
                      setEditData({ ...editData, qtdDoses: +e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Immunization Complete?</Form.Label>
                  <Form.Check
                    type="checkbox"
                    checked={editData.imunizacaoCompleta || false}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        imunizacaoCompleta: e.target.checked,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Select Person</Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.personID || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, personID: e.target.value })
                    }
                    className="w-100"
                  >
                    <option value="">Select a person</option>
                    {Object.entries(person).map(([key, person]) => (
                      <option key={key} value={key}>
                        {`${person.name} ${person.surname}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <p className="initial" />
                <Button variant="success" onClick={handleSave} className="w-50">
                  Save Changes
                </Button>
                <p className="initial" />
              </Form>
            </Col>
          </Row>
        )}
      </Container>
      <p className="initial" />
    </>
  );
}

export default PatientManagement;
