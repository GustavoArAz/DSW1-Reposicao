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

interface Person {
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  email: string;
  contact: string;
  addressId: string;
}

interface Address {
  road: string;
  city: string;
  state: string;
  cep: string;
  comment: string;
}

function PersonManagement() {
  const [person, setPerson] = useState<Record<string, Person>>({});
  const [addresses, setAddresses] = useState<Record<string, Address>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Person>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all persons
    const personRef = ref(database, "persons");
    const unsubscribePerson = onValue(personRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPerson(data);
        setLoading2(false);
      }
    });

    // Fetch all addresses
    const addressRef = ref(database, "addresses");
    const unsubscribeAddress = onValue(addressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAddresses(data);
        setLoading(false);
      }
    });

    return () => {
      unsubscribePerson();
      unsubscribeAddress();
    };
  }, []);

  useEffect(() => {
    // Log person and patient states for debugging
    console.log("Person state:", person);
    console.log("Addresses state:", addresses);
  }, [person, addresses]);

  const handleEdit = (id: string) => {
    const personToEdit = person[id];
    setEditId(id);
    setEditData(personToEdit);
  };

  const handleRemove = (id: string) => {
    const personRef = ref(database, `persons/${id}`);
    remove(personRef).then(() => {
      const newPerson = { ...person };
      delete newPerson[id];
      setPerson(newPerson);
    });
  };

  const handleSave = () => {
    if (editId && editData) {
      const updatedData = { ...editData, addressId: editData.addressId || "" };
      const personRef = ref(database, `persons/${editId}`);
      update(personRef, updatedData).then(() => {
        setPerson({
          ...person,
          [editId]: { ...person[editId], ...updatedData },
        });
        setEditId(null);
        setEditData({});
      });
    }
  };

  if (loading || loading2) {
    return (
      <Container fluid className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <h3 className="centered-header">People</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>CPF</th>
                  <th>RG</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Road</th>
                  <th>City</th>
                  <th>State</th>
                  <th>CEP</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(person).map(([key, person]) => {
                  const address = addresses[person.addressId]; // Find the address by addressId
                  console.log(`person.addressId ${key}:`, person.addressId); // Log for debugging
                  console.log(`Address for addressId ${key}:`, address); // Log for debugging

                  return (
                    <tr key={key}>
                      <td>{person.name}</td>
                      <td>{person.surname}</td>
                      <td>{person.cpf}</td>
                      <td>{person.rg}</td>
                      <td>{person.email}</td>
                      <td>{person.contact}</td>
                      <td>{address ? address.road : "N/A"}</td>
                      <td>{address ? address.city : "N/A"}</td>
                      <td>{address ? address.state : "N/A"}</td>
                      <td>{address ? address.cep : "N/A"}</td>
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
              <h5>Edit Person</h5>
              <Form>
                <Form.Group className="mb-1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.surname || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, surname: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.cpf || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, cpf: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>RG</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.rg || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, rg: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.email || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.contact || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, contact: e.target.value })
                    }
                    className="w-100"
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="select"
                    value={editData.addressId || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, addressId: e.target.value })
                    }
                    className="w-100"
                  >
                    <option value="">Select an address</option>
                    {Object.entries(addresses).map(([id, address]) => (
                      <option key={id} value={id}>
                        {`${address.road}, ${address.city}, ${address.state} - ${address.cep}`}
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

export default PersonManagement;
