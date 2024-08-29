import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function VNavbar() {
  return (
    <Navbar bg="danger" variant="dark" expand="lg">
      <Navbar.Brand>Controle Vacinas</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/registrymanagement">
            Registry Management
          </Nav.Link>
          <NavDropdown title="Registry Creation" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/formAddress">
              Address Registry
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/formPerson">
              Person Registry
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/formPacient">
              Pacient Registry
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/formProfessional">
              Health Professional Registry
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/formManufacturer">
              Manufacturer Registry
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/requests">
            Requests
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default VNavbar;
