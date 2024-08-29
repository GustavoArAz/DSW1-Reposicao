import { getDatabase, ref, onValue, push, set } from "firebase/database";
import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
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

function VaccinationForm() {
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dose, setDose] = useState("");
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [person, setPerson] = useState<Record<string, Person>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const addressesRef = ref(database, "addresses");
    const unsubscribeAddress = onValue(addressesRef, (snapshot) => {
      const addressData = snapshot.val();
      if (addressData) {
        const addressList = Object.entries(addressData).map(([key, value]) => ({
          ...(value as Address),
          id: key,
        }));
        setAddresses(addressList);
      }
    });

    const patientsRef = ref(database, "pacients");
    const unsubscribePatient = onValue(patientsRef, (snapshot) => {
      const patientData = snapshot.val();
      if (patientData) {
        const patientList = Object.entries(patientData).map(([key, value]) => ({
          ...(value as Patient),
          id: key,
        }));
        setPatients(patientList);
      }
    });

    const manufacturersRef = ref(database, "manufacturers");
    const unsubscribeManufacturer = onValue(manufacturersRef, (snapshot) => {
      const manufacturerData = snapshot.val();
      if (manufacturerData) {
        const manufacturerList = Object.entries(manufacturerData).map(
          ([key, value]) => ({
            ...(value as Manufacturer),
            id: key,
          })
        );
        setManufacturers(manufacturerList);
      }
    });

    const professionalsRef = ref(database, "professional");
    const unsubscribeProfessional = onValue(professionalsRef, (snapshot) => {
      const professionalData = snapshot.val();
      if (professionalData) {
        const professionalList = Object.entries(professionalData).map(
          ([key, value]) => ({
            ...(value as Professional),
            id: key,
          })
        );
        setProfessionals(professionalList);
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
      unsubscribeAddress();
      unsubscribeManufacturer();
      unsubscribePatient();
      unsubscribeProfessional();
      unsubscribePerson();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const vaccineRef = ref(database, "vaccines");
    const newVaccine = push(vaccineRef);
    set(newVaccine, {
      dataAplicacao,
      dose,
      professionalId: selectedProfessional,
      patientId: selectedPatient,
      manufacturerId: selectedManufacturer,
      addressId: selectedAddress,
    });
    setDataAplicacao("");
    setDose("");
    setSelectedProfessional("");
    setSelectedPatient("");
    setSelectedManufacturer("");
    setSelectedAddress("");
    alert("Vaccination saved!");
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
      <h3 className="centered-header">
        Form for the registration of a Vaccination
      </h3>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="bordered-form">
            <Form onSubmit={handleSubmit}>
              <p className="initial" />
              <Form.Group className="mb-1" controlId="formDate">
                <Form.Label>Date of Vaccination: </Form.Label>
                <Form.Control
                  type="date"
                  value={dataAplicacao}
                  onChange={(e) => setDataAplicacao(e.target.value)}
                  placeholder="Enter date"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formDose">
                <Form.Label>Dose: </Form.Label>
                <Form.Control
                  type="text"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="Enter dose"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formManufacturer">
                <Form.Label>Select Manufacturer</Form.Label>
                <Form.Control
                  as="select"
                  title="Select a manufacturer" // Added title attribute
                  value={selectedManufacturer}
                  onChange={(e) => setSelectedManufacturer(e.target.value)}
                  required
                >
                  <option value="">Select a manufacturer</option>
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer.id} value={manufacturer.id}>
                      {`${manufacturer.description}, Qnt=${manufacturer.quantity}, Batch ${manufacturer.batch} | Due Date: ${manufacturer.dueDate}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-1" controlId="formProfessional">
                <Form.Label>Select Health Professional</Form.Label>
                <Form.Control
                  as="select"
                  title="Select a professional" // Added title attribute
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  required
                >
                  <option value="">Select a professional</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {`${person[professional.personID].name} ${
                        person[professional.personID].surname
                      } | ${professional.profissao}, ${
                        professional.registroConselho
                      }`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-1" controlId="formPatient">
                <Form.Label>Select Patient</Form.Label>
                <Form.Control
                  as="select"
                  title="Select a patient" // Added title attribute
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {`${person[patient.personID].name} ${
                        person[patient.personID].surname
                      } | Doses: ${patient.qtdDoses}, Imunização Completa? ${
                        patient.imunizacaoCompleta
                      }`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-1" controlId="formAddress">
                <Form.Label>Select Address</Form.Label>
                <Form.Control
                  as="select"
                  title="Select an address" // Added title attribute
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  required
                >
                  <option value="">Select an address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {`${address.road}, ${address.city}, ${address.state} - ${address.cep}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <p className="initial" />
              <Button variant="danger" type="submit">
                Submit
              </Button>
              <p className="initial" />
            </Form>
          </Col>
        </Row>
      </Container>
      <p className="initial" />
    </>
  );
}

export default VaccinationForm;
