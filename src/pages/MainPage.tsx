import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import VaccineManagement from "../components/VaccineManagement";
import VaccinationForm from "../components/VaccineRegistryForm";
import Dashboard1 from "../components/Dashboard1";
import Dashboard2 from "../components/Dashboard2";
import Dashboard3 from "../components/Dashboard3";
import Dashboard4 from "../components/Dashboard4";

function MainPage() {
  // State to keep track of the currently displayed component
  const [currentComponent, setCurrentComponent] = useState<
    "none" | "one" | "two"
  >("none");

  // Handlers for the buttons
  const showComponentOne = () => {
    setCurrentComponent("one");
  };

  const showComponentTwo = () => {
    setCurrentComponent("two");
  };

  return (
    <>
      <Container fluid>
        <p className="initial" />
        <Row>
          <Col>
            <Dashboard1 />
            <Dashboard2 />
            <Dashboard3 />
            <Dashboard4 />
          </Col>
        </Row>
        <p className="initial" />
        <Row>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentOne}
            >
              Register Vaccination
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentTwo}
            >
              Manage Vaccinations
            </Button>
          </Col>
        </Row>
        <p className="initial" />
        <Row>
          <Col>
            {currentComponent === "one" && <VaccinationForm />}
            {currentComponent === "two" && <VaccineManagement />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainPage;
