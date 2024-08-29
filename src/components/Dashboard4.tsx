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

function Dashboard4() {
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

  const getVaccineApplicationsPerMonth = () => {
    const monthCount: Record<string, number> = {};

    Object.values(vaccines).forEach((vaccine) => {
      const date = new Date(vaccine.dataAplicacao);
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-M

      if (monthCount[yearMonth]) {
        monthCount[yearMonth] += 1;
      } else {
        monthCount[yearMonth] = 1;
      }
    });

    return monthCount;
  };

  const monthlyVaccineApplications = getVaccineApplicationsPerMonth();

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
        <h3 className="dashboard-font">Vaccines Administered Per Month</h3>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={11}>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Number of Vaccines Administered</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(monthlyVaccineApplications).map(
                    ([yearMonth, count]) => (
                      <tr>
                        <td>{yearMonth}</td>
                        <td>{count} application(s)</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Dashboard4;
