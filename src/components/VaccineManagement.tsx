import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import app from "../firebaseConfig";

const database = getDatabase(app);

interface Manufacturer {
  id: string;
  description: string;
  batch: string;
  dueDate: string;
  quantity: number;
}

interface Address {
  id: string;
  road: string;
  city: string;
  state: string;
  cep: string;
  comment: string;
}

interface Person {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  email: string;
  contact: string;
  addressId: string;
}

interface Patient {
  id: string;
  qtdDoses: number;
  imunizacaoCompleta: boolean;
  personID: string;
}

interface Professional {
  id: string;
  profissao: string;
  registroConselho: string;
  personID: string;
}

interface Vaccine {
  manufacturerId: string;
  professionalId: string;
  patientId: string;
  addressId: string;
  dataAplicacao: string;
  dose: string;
}

function VaccineManagement() {
  const [manufacturers, setManufacturers] = useState<
    Record<string, Manufacturer>
  >({});
  const [professionals, setProfessionals] = useState<
    Record<string, Professional>
  >({});
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [addressess, setAddresses] = useState<Record<string, Address>>({});
  const [persons, setPersons] = useState<Record<string, Person>>({});
  const [vaccines, setVaccines] = useState<Record<string, Vaccine>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Vaccine>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all vaccines
    const vaccinesRef = ref(database, "vaccines");
    const unsubscribeVaccines = onValue(vaccinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVaccines(data);
      }
    });

    // Fetch all professionals
    const professionalsRef = ref(database, "professional");
    const unsubscribeProfessionals = onValue(professionalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfessionals(data);
      }
    });

    // Fetch all patients
    const patientsRef = ref(database, "pacients");
    const unsubscribePatients = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPatients(data);
      }
    });

    // Fetch all addresses
    const addressessRef = ref(database, "addresses");
    const unsubscribeAddressess = onValue(addressessRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAddresses(data);
      }
    });

    // Fetch all manufacturers
    const manufacturersRef = ref(database, "manufacturers");
    const unsubscribeManufacturers = onValue(manufacturersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setManufacturers(data);
      }
    });

    // Fetch all persons
    const personsRef = ref(database, "persons");
    const unsubscribePersons = onValue(personsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPersons(data);
        setLoading(false); // Data has loaded
      }
    });

    return () => {
      unsubscribeVaccines();
      unsubscribeProfessionals();
      unsubscribePatients();
      unsubscribeAddressess();
      unsubscribeManufacturers();
      unsubscribePersons();
    };
  }, []);

  const handleEdit = (id: string) => {
    const vaccineToEdit = vaccines[id];
    setEditId(id);
    setEditData(vaccineToEdit);
  };

  const handleRemove = (id: string) => {
    const vaccinesRef = ref(database, `vaccines/${id}`);
    remove(vaccinesRef).then(() => {
      const newVaccine = { ...vaccines };
      delete newVaccine[id];
      setVaccines(newVaccine);
    });
  };

  const handleSave = () => {
    if (editId && editData) {
      const vaccinesRef = ref(database, `vaccines/${editId}`);
      update(vaccinesRef, editData).then(() => {
        setVaccines({
          ...vaccines,
          [editId]: { ...vaccines[editId], ...editData },
        });
        setEditId(null);
        setEditData({});
      });
    }
  };

  if (loading) {
    return (
      <Container fluid className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">Vaccines</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Patient</th> {/* Name Surname */}
                  <th>Professional</th> {/* Name Surname - Profession */}
                  <th>Dose</th>
                  <th>Date</th>
                  <th>Manufacturer</th> {/* Description - Batch */}
                  <th>Address</th> {/* Road, City, State */}
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(vaccines).map(([key, vaccine]) => {
                  const patient = patients[vaccine.patientId]; // Find the patient by patientId
                  const professional = professionals[vaccine.professionalId]; // Find the professional by professionalId
                  const manufacturer = manufacturers[vaccine.manufacturerId]; // Find the manufacturer by manufacturerId
                  const address = addressess[vaccine.addressId]; // Find the address by addressId

                  return (
                    <tr key={key}>
                      <td>
                        {patient
                          ? persons[patient.personID].name +
                            " " +
                            persons[patient.personID].surname
                          : "N/A"}
                      </td>
                      <td>
                        {professional
                          ? persons[professional.personID].name +
                            " " +
                            persons[professional.personID].surname
                          : "N/A"}
                      </td>
                      <td>{vaccine.dose}</td>
                      <td>{vaccine.dataAplicacao}</td>
                      <td>
                        {manufacturer
                          ? manufacturer.description +
                            " - " +
                            manufacturer.batch
                          : "N/A"}
                      </td>
                      <td>
                        {address
                          ? address.road +
                            ", " +
                            address.city +
                            ", " +
                            address.state
                          : "N/A"}
                      </td>
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
              <h5>Edit Vaccine</h5>
              <Form>
                <Form.Group className="mb-1">
                  <Form.Label>Date of Vaccination: </Form.Label>
                  <Form.Control
                    type="date"
                    value={
                      editData.dataAplicacao
                        ? new Date(editData.dataAplicacao)
                            .toISOString()
                            .substring(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        dataAplicacao: e.target.value,
                      })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Dose: </Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.dose || 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        dose: e.target.value,
                      })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Patient: </Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.patientId || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        patientId: e.target.value,
                      })
                    }
                    className="w-100"
                  >
                    <option value="">Select Patient</option>
                    {Object.entries(patients).map(([id, patient]) => (
                      <option key={id} value={id}>
                        {persons[patient.personID]?.name}{" "}
                        {persons[patient.personID]?.surname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-1">
                  <Form.Label>Professional: </Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.professionalId || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        professionalId: e.target.value,
                      })
                    }
                    className="w-100"
                  >
                    <option value="">Select Professional</option>
                    {Object.entries(professionals).map(([id, professional]) => (
                      <option key={id} value={id}>
                        {persons[professional.personID]?.name}{" "}
                        {persons[professional.personID]?.surname} -{" "}
                        {professional.profissao}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-1">
                  <Form.Label>Address: </Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.addressId || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        addressId: e.target.value,
                      })
                    }
                    className="w-100"
                  >
                    <option value="">Select Address</option>
                    {Object.entries(addressess).map(([id, address]) => (
                      <option key={id} value={id}>
                        {address.road}, {address.city}, {address.state}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-1">
                  <Form.Label>Manufacturer: </Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.manufacturerId || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        manufacturerId: e.target.value,
                      })
                    }
                    className="w-100"
                  >
                    <option value="">Select Manufacturer</option>
                    {Object.entries(manufacturers).map(([id, manufacturer]) => (
                      <option key={id} value={id}>
                        {manufacturer.description} - {manufacturer.batch}
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

export default VaccineManagement;
