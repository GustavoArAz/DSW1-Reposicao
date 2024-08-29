import { Button, Form, Container, Row, Col } from "react-bootstrap";
import app from "../firebaseConfig";
import { getDatabase, push, ref, set } from "firebase/database";
import { useState } from "react";

const database = getDatabase(app);

function ManufacturerRegistryForm() {
  const [description, setDescription] = useState("");
  const [batch, setBatch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const manufacturerRef = ref(database, "manufacturers");
    const newManufacturer = push(manufacturerRef);

    set(newManufacturer, { description, batch, dueDate, quantity });
    setDescription("");
    setBatch("");
    setDueDate(Date());
    setQuantity(0);
    alert("Manufacturer saved!");
  };

  return (
    <>
      <p className="initial" />
      <h3 className="centered-header">
        Form for the registration of a manufacturer
      </h3>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="bordered-form">
            <Form onSubmit={handleSubmit}>
              <p className="initial" />
              <Form.Group className="mb-1" controlId="formDescription">
                <Form.Label>Description: </Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formBatch">
                <Form.Label>Bacth: </Form.Label>
                <Form.Control
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="Enter batch"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formDueDate">
                <Form.Label>Due Date: </Form.Label>
                <Form.Control
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Enter due date"
                  required
                  className="w-100"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formQuantity">
                <Form.Label>Quantity: </Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  placeholder="Enter quantity"
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

export default ManufacturerRegistryForm;
