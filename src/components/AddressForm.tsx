import { Button, Form, Container, Row, Col } from "react-bootstrap";
import app from "../firebaseConfig";
import { getDatabase, push, ref, set } from "firebase/database";
import { useState } from "react";

const database = getDatabase(app);

function AddressForm() {
  const [road, setRoad] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cep, setCep] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const addressRef = ref(database, "addresses");
    const newAddress = push(addressRef);

    set(newAddress, { road, city, state, cep, comment });
    setRoad("");
    setCity("");
    setState("");
    setCep("");
    setComment("");
    alert("Address saved!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">
        Form for the registration of an address
      </h3>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="bordered-form">
            <Form onSubmit={handleSubmit}>
              <p className="initial" />
              <Form.Group className="mb-1" controlId="formRoad">
                <Form.Label>Road: </Form.Label>
                <Form.Control
                  type="text"
                  value={road}
                  onChange={(e) => setRoad(e.target.value)}
                  placeholder="Enter road"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formCity">
                <Form.Label>City: </Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formState">
                <Form.Label>State: </Form.Label>
                <Form.Control
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter state"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formCEP">
                <Form.Label>CEP: </Form.Label>
                <Form.Control
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Enter CEP"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formCommentary">
                <Form.Label>Comment: </Form.Label>
                <Form.Control
                  as="textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Additional commentary"
                  rows={1}
                  className="w-100"
                />
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

export default AddressForm;
