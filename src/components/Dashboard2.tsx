import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebaseConfig";
import { Col, Container, Row, Spinner, Table } from "react-bootstrap";

const database = getDatabase(app);

interface Vaccine {
  manufacturerId: string;
  professionalId: string;
  patientId: string;
  addressId: string;
  dataAplicacao: string;
  dose: string;
}

interface Manufacturer {
  id: string;
  description: string;
  batch: string;
  dueDate: string;
  quantity: number;
}

function Dashboard2() {
  const [vaccines, setVaccines] = useState<Record<string, Vaccine>>({});
  const [manufacturers, setManufacturers] = useState<
    Record<string, Manufacturer>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all vaccines
    const vaccinesRef = ref(database, "vaccines");
    const unsubscribeVaccines = onValue(vaccinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVaccines(data);
      }
    });

    // Fetch all manufacturers
    const manufacturersRef = ref(database, "manufacturers");
    const unsubscribeManufacturers = onValue(manufacturersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setManufacturers(data);
        setLoading(false); // Data has loaded
      }
    });

    return () => {
      unsubscribeVaccines();
      unsubscribeManufacturers();
    };
  }, []);

  const getVaccinesPerManufacturer = () => {
    const count: Record<string, number> = {};

    Object.values(vaccines).forEach((vaccine) => {
      if (vaccine.manufacturerId) {
        if (count[vaccine.manufacturerId]) {
          count[vaccine.manufacturerId] += 1;
        } else {
          count[vaccine.manufacturerId] = 1;
        }
      }
    });

    return count;
  };

  const vaccinesPerManufacturer = getVaccinesPerManufacturer();

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
      <div className="dashboard-border">
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={11}>
              <h3 className="dashboard-font">
                Vaccines Administered Per Manufacturer
              </h3>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Manufacturer</th>
                    <th>Total Vaccines Administered</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(vaccinesPerManufacturer).map(
                    ([manufacturerId, count]) => {
                      const manufacturer = manufacturers[manufacturerId];
                      return (
                        <tr key={manufacturerId}>
                          <td>
                            {manufacturer
                              ? `${manufacturer.description} - ${manufacturer.batch}`
                              : "Unknown Manufacturer"}
                          </td>
                          <td>{count}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
      <p className="initial" />
    </>
  );
}

export default Dashboard2;
