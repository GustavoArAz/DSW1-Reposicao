import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebaseConfig";
import { Col, Container, Row, Spinner } from "react-bootstrap";

const database = getDatabase(app);

interface Vaccine {
  manufacturerId: string;
  professionalId: string;
  patientId: string;
  addressId: string;
  dataAplicacao: string;
  dose: string;
}

function Dashboard1() {
  const [vaccines, setVaccines] = useState<Record<string, Vaccine>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all vaccines
    const vaccinesRef = ref(database, "vaccines");
    const unsubscribeVaccines = onValue(vaccinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVaccines(data);
        setLoading(false); // Data has loaded
      }
    });

    return () => {
      unsubscribeVaccines();
    };
  }, []);

  const getTotalVaccinesAdministered = () => {
    return Object.keys(vaccines).length;
  };

  const totalVaccinesAdministered = getTotalVaccinesAdministered();

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
          <Row>
            <Col>
              <h5 className="dashboard-font">
                Total Vaccines Administered: {totalVaccinesAdministered}
              </h5>
            </Col>
          </Row>
        </Container>
      </div>
      <p className="initial" />
    </>
  );
}

export default Dashboard1;
