import { useEffect, useState } from "react";
import app from "../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import { Table, Container, Row, Col, Spinner } from "react-bootstrap";

const database = getDatabase(app);

interface Request {
  name: string;
  email: string;
  description: string;
}

function Requests() {
  const [request, setRequest] = useState<Record<string, Request>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Reference to the 'lfgFormLeagueOfLegends' node in the database
    const requestRef = ref(database, "support");
    // const recentPostsQuery = query(requestRef, limitToLast(10));

    const unsubscribe = onValue(requestRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRequest(data);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
      <p className="initial" />
      <h3 className="centered-header">Latest Support Requests</h3>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs={12} md={11}>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(request).map(([key, request]) => (
                  <tr key={key}>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{request.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <p className="initial" />
    </>
  );
}

export default Requests;
