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

function ProfessionalRegistryForm() {
  const [registroConselho, setRegistroConselho] = useState("");
  const [profissao, setProfissao] = useState("");
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

    const professionalRef = ref(database, "professional");
    const newPacient = push(professionalRef);
    set(newPacient, {
      registroConselho,
      profissao,
      personID: selectedPerson,
    });
    setRegistroConselho("");
    setProfissao("");
    setSelectedPerson("");
    alert("Professional saved!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">
        Form for the registration of a professional
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

              <Form.Group className="mb-1" controlId="formProfession">
                <Form.Label>Profession: </Form.Label>
                <Form.Control
                  type="text"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  placeholder="Enter profession"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formBoardRegistration">
                <Form.Label>Board Registration: </Form.Label>
                <Form.Control
                  type="text"
                  value={registroConselho}
                  onChange={(e) => setRegistroConselho(e.target.value)}
                  placeholder="Enter board registration"
                  required
                  className="w-100"
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

export default ProfessionalRegistryForm;
