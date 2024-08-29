import { Button, Form, Container, Row, Col } from "react-bootstrap";
import app from "../firebaseConfig";
import { getDatabase, push, ref, set } from "firebase/database";
import { useState } from "react";

const database = getDatabase(app);

function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const supportRef = ref(database, "support");
    const newSupport = push(supportRef);

    set(newSupport, { name, email, description });
    setName("");
    setEmail("");
    setDescription("");
    alert("Support message sent!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">
        Form for the registration of a support ticket
      </h3>
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
              <Form.Group className="mb-1" controlId="formEmail">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formDescription">
                <Form.Label>Description: </Form.Label>
                <Form.Control
                  as="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  rows={5}
                  required
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

export default Support;
