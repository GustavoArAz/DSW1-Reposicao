import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../footer.css";

function Footer() {
  return (
    <footer className="bg-danger text-light py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="d-flex justify-content-center">About Us</h5>
            <p>
              This is a website made for the management and control of vaccine
              applications, the pacients and professionals involved in the
              process, as well as what manufactures made the vaccines that were
              used and some additional data in that regard.
            </p>
          </Col>
          <Col md={4}>
            <h5 className="d-flex justify-content-center">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/support"
                  className="footer-link d-flex justify-content-center"
                >
                  Support Page
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="footer-link d-flex justify-content-center"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="footer-link d-flex justify-content-center"
                >
                  Home
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="d-flex justify-content-center">Contact Us</h5>
            <address>
              1234 Main St.
              <br />
              City, State, 12345
              <br />
              Email:{" "}
              <a href="mailto:info@company.com" className="text-light">
                info@company.com
              </a>
              <br />
              Phone: (123) 456-7890
            </address>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Controle Vacinas. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
