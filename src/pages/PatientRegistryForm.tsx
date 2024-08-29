import { getDatabase, ref, onValue, push, set } from "firebase/database";
import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import app from "../firebaseConfig";

const database = getDatabase(app);

interface Person {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  email: string;
  contact: string;
  address: Address;
}

interface Address {
  id: string;
  road: string;
  city: string;
  state: string;
  cep: string;
  comment: string;
}

function PacientRegistryForm() {
  const [qtdDoses, setQtdDoses] = useState(0);
  const [imunizacaoCompleta, setImunizacaoCompleta] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>("");

  useEffect(() => {
    const personsRef = ref(database, "persons");
    onValue(personsRef, (snapshot) => {
      const personData = snapshot.val();
      if (personData) {
        const personList = Object.entries(personData).map(([key, value]) => ({
          ...(value as Person),
          id: key,
        }));
        setPersons(personList);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pacientRef = ref(database, "pacients");
    const newPacient = push(pacientRef);
    set(newPacient, {
      qtdDoses,
      imunizacaoCompleta,
      personID: selectedPerson,
    });
    setQtdDoses(0);
    setImunizacaoCompleta(false);
    setSelectedPerson("");
    alert("Pacient saved!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">
        Form for the registration of a patient
      </h3>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="bordered-form">
            <p className="initial" />
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-1" controlId="formPerson">
                <Form.Label htmlFor="personSelect">Select Person</Form.Label>
                <Form.Control
                  as="select"
                  id="personSelect"
                  title="Select a person" // Added title attribute
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  required
                >
                  <option value="">Select a person</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {`${person.name} ${person.surname}, ${person.cpf}, ${person.email}, ${person.rg}, ${person.contact}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-1" controlId="formQtdDoses">
                <Form.Label>Quantity of Doses: </Form.Label>
                <Form.Control
                  type="number"
                  value={qtdDoses}
                  onChange={(e) => setQtdDoses(+e.target.value)}
                  placeholder="Enter quantity of doses"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formImunizacaoCompleta">
                <Form.Label>Complete immunization?</Form.Label>
                <Form.Check
                  type="checkbox"
                  onChange={(e) =>
                    setImunizacaoCompleta(Boolean(e.target.value))
                  }
                  required
                />
              </Form.Group>

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

export default PacientRegistryForm;
