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

interface Person {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  rg: string;
  email: string;
  contact: string;
  addressId: string;
}

interface Professional {
  id: string;
  profissao: string;
  registroConselho: string;
  personID: string;
}

function Dashboard3() {
  const [vaccines, setVaccines] = useState<Record<string, Vaccine>>({});
  const [persons, setPersons] = useState<Record<string, Person>>({});
  const [professionals, setProfessionals] = useState<
    Record<string, Professional>
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

    // Fetch all professionals
    const professionalsRef = ref(database, "professional");
    const unsubscribeProfessionals = onValue(professionalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfessionals(data);
      }
    });

    // Fetch all persons
    const personsRef = ref(database, "persons");
    const unsubscribePersons = onValue(personsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPersons(data);
        setLoading(false); // Data has loaded
      }
    });

    return () => {
      unsubscribeVaccines();
      unsubscribeProfessionals();
      unsubscribePersons();
    };
  }, []);

  const getVaccineCountPerProfessional = () => {
    const professionalCount: Record<string, number> = {};

    Object.values(vaccines).forEach((vaccine) => {
      const professionalId = vaccine.professionalId;
      if (professionalCount[professionalId]) {
        professionalCount[professionalId] += 1;
      } else {
        professionalCount[professionalId] = 1;
      }
    });

    return professionalCount;
  };

  const getTopProfessional = () => {
    const professionalCount = getVaccineCountPerProfessional();
    let topProfessionalId = "";
    let maxCount = 0;

    for (const [professionalId, count] of Object.entries(professionalCount)) {
      if (count > maxCount) {
        maxCount = count;
        topProfessionalId = professionalId;
      }
    }

    return topProfessionalId;
  };

  const topProfessionalId = getTopProfessional();
  const topProfessional = professionals[topProfessionalId] || {
    id: "",
    profissao: "N/A",
    registroConselho: "N/A",
    personID: "",
  };
  const topProfessionalName = persons[topProfessional.personID]
    ? `${persons[topProfessional.personID].name} ${
        persons[topProfessional.personID].surname
      }`
    : "N/A";

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
        <h3 className="dashboard-font">Top Professional</h3>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={11}>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Profession</th>
                    <th>Registration</th>
                    <th>Number of Vaccines Administered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{topProfessionalName}</td>
                    <td>{topProfessional.profissao}</td>
                    <td>{topProfessional.registroConselho}</td>
                    <td>
                      {" "}
                      {getVaccineCountPerProfessional()[topProfessionalId || 0]}
                    </td>
                  </tr>
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

export default Dashboard3;
