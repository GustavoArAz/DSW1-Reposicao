import { getDatabase, ref, onValue, push, set } from "firebase/database";
import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import app from "../firebaseConfig";

const database = getDatabase(app);

interface Address {
  id: string;
  road: string;
  city: string;
  state: string;
  cep: string;
  comment: string;
}

function PersonForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cpf, setCPF] = useState("");
  const [rg, setRG] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    const addressesRef = ref(database, "addresses");
    onValue(addressesRef, (snapshot) => {
      const addressData = snapshot.val();
      if (addressData) {
        const addressList = Object.entries(addressData).map(([key, value]) => ({
          ...(value as Address),
          id: key,
        }));
        setAddresses(addressList);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const personRef = ref(database, "persons");
    const newPerson = push(personRef);
    set(newPerson, {
      name,
      surname,
      cpf,
      rg,
      email,
      contact,
      addressId: selectedAddress,
    });
    setName("");
    setSurname("");
    setCPF("");
    setRG("");
    setEmail("");
    setContact("");
    setSelectedAddress("");
    alert("Person saved!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">Form for the registration of a person</h3>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="bordered-form">
            <Form onSubmit={handleSubmit}>
              <p className="initial" />
              <Form.Group className="mb-1" controlId="formName">
                <Form.Label>Name: </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formSurname">
                <Form.Label>Surname: </Form.Label>
                <Form.Control
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Enter surname"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formCPF">
                <Form.Label>CPF: </Form.Label>
                <Form.Control
                  type="text"
                  value={cpf}
                  onChange={(e) => setCPF(e.target.value)}
                  placeholder="Enter CPF"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formRG">
                <Form.Label>RG: </Form.Label>
                <Form.Control
                  type="text"
                  value={rg}
                  onChange={(e) => setRG(e.target.value)}
                  placeholder="Enter RG"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formEmail">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formContact">
                <Form.Label>Contact: </Form.Label>
                <Form.Control
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter contact"
                  required
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="mb-1" controlId="formAddress">
                <Form.Label htmlFor="addressSelect">Select Address</Form.Label>
                <Form.Control
                  as="select"
                  id="addressSelect"
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

export default PersonForm;
