import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AddressManagement from "../components/AddressManagement";
import PersonManagement from "../components/PeopleManagement";
import PatientManagement from "../components/PatientManagement";
import ProfessionalManagement from "../components/ProfessionalManagement";
import ManufacturerManagement from "../components/ManufacturerManagement";

function RegistryManagement() {
  // State to keep track of the currently displayed component
  const [currentComponent, setCurrentComponent] = useState<
    "none" | "one" | "two" | "three" | "four" | "five"
  >("none");

  // Handlers for the buttons
  const showComponentOne = () => setCurrentComponent("one");
  const showComponentTwo = () => setCurrentComponent("two");
  const showComponentThree = () => setCurrentComponent("three");
  const showComponentFour = () => setCurrentComponent("four");
  const showComponentFive = () => setCurrentComponent("five");

  return (
    <>
      <Container fluid>
        <p className="initial" />
        <Row>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentOne}
            >
              Addresses
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentTwo}
            >
              People
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentThree}
            >
              Pacients
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentFour}
            >
              Health Professionals
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              variant="danger"
              className="w-100"
              onClick={showComponentFive}
            >
              Manufacturers
            </Button>
          </Col>
        </Row>
        <p className="initial" />
        <Row>
          <Col>
            {currentComponent === "one" && <AddressManagement />}
            {currentComponent === "two" && <PersonManagement />}
            {currentComponent === "three" && <PatientManagement />}
            {currentComponent === "four" && <ProfessionalManagement />}
            {currentComponent === "five" && <ManufacturerManagement />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RegistryManagement;
