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

interface Manufacturer {
  quantity: number;
  dueDate: string;
  batch: string;
  description: string;
}

function ManufacturerManagement() {
  const [manufacturer, setManufacturer] = useState<
    Record<string, Manufacturer>
  >({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Manufacturer>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const manufacturerRef = ref(database, "manufacturers");

    const unsubscribe = onValue(manufacturerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setManufacturer(data);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (id: string) => {
    const manufacturerToEdit = manufacturer[id];
    setEditId(id);
    setEditData(manufacturerToEdit);
  };

  const handleRemove = (id: string) => {
    const manufacturerRef = ref(database, `manufacturers/${id}`);
    remove(manufacturerRef).then(() => {
      const newManufacturer = { ...manufacturer };
      delete newManufacturer[id];
      setManufacturer(newManufacturer);
    });
  };

  const handleSave = () => {
    if (editId && editData) {
      const manufacturerRef = ref(database, `manufacturers/${editId}`);
      update(manufacturerRef, editData).then(() => {
        setManufacturer({
          ...manufacturer,
          [editId]: { ...manufacturer[editId], ...editData },
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
      <h3 className="centered-header">Manufacturers</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Quantity</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(manufacturer).map(([key, manufacturer]) => (
                  <tr key={key}>
                    <td>{manufacturer.batch}</td>
                    <td>{manufacturer.description}</td>
                    <td>{String(manufacturer.dueDate)}</td>
                    <td>{manufacturer.quantity}</td>
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
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {editId && (
          <Row className="justify-content-md-center">
            <Col xs={12} md={6} className="bordered-form">
              <p className="initial" />
              <h5>Edit Manufacturer</h5>
              <Form>
                <Form.Group className="mb-1">
                  <Form.Label>Batch</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.batch || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, batch: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={
                      editData.dueDate
                        ? new Date(editData.dueDate)
                            .toISOString()
                            .substring(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={editData.quantity || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, quantity: +e.target.value })
                    }
                    className="w-100"
                  />
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

export default ManufacturerManagement;
