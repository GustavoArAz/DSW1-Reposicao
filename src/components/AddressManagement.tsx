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

interface Address {
  road: string;
  city: string;
  state: string;
  cep: string;
  comment: string;
}

function AddressManagement() {
  const [address, setAddress] = useState<Record<string, Address>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Address>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const addressRef = ref(database, "addresses");

    const unsubscribe = onValue(addressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAddress(data);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (id: string) => {
    const addressToEdit = address[id];
    setEditId(id);
    setEditData(addressToEdit);
  };

  const handleRemove = (id: string) => {
    const addressRef = ref(database, `addresses/${id}`);
    remove(addressRef).then(() => {
      const newAddress = { ...address };
      delete newAddress[id];
      setAddress(newAddress);
    });
  };

  if (loading) {
    return (
      <Container fluid className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  const handleSave = () => {
    if (editId && editData) {
      const addressRef = ref(database, `addresses/${editId}`);
      update(addressRef, editData).then(() => {
        setAddress({
          ...address,
          [editId]: { ...address[editId], ...editData },
        });
        setEditId(null);
        setEditData({});
      });
    }
  };

  return (
    <>
      <h3 className="centered-header">Addresses</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Road</th>
                  <th>City</th>
                  <th>State</th>
                  <th>CEP</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(address).map(([key, address]) => (
                  <tr key={key}>
                    <td>{address.road}</td>
                    <td>{address.city}</td>
                    <td>{address.state}</td>
                    <td>{address.cep}</td>
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
              <h5>Edit Address</h5>
              <Form>
                <Form.Group className="mb-1">
                  <Form.Label>Road</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.road || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, road: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.city || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, city: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.state || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, state: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.cep || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, cep: e.target.value })
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

export default AddressManagement;
