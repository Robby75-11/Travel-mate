import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
// Importa le icone social da react-icons/fa
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="main-footer mt-auto">
      {" "}
      {/* Applica la classe definita in App.css */}
      <Container>
        <Row>
          {/* Colonna 1: Il Gruppo Travel Mate */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5>Il Gruppo Travel Mate</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/about">Chi Siamo</Link>
              </li>
              <li>
                <Link to="/work-with-us">Lavora con Noi</Link>
              </li>
              <li>
                <Link to="/contacts">Contatti</Link>
              </li>
              <li>
                <Link to="/reserved-area">Area Riservata</Link>
              </li>
            </ul>
          </Col>

          {/* Colonna 2: Servizi */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5>Servizi</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/insurance">Assicurazioni</Link>
              </li>
              <li>
                <Link to="/app">App Travel Mate</Link>
              </li>
              <li>
                <Link to="/conventions">Convenzioni</Link>
              </li>
              <li>
                <Link to="/excursions">Escursioni</Link>
              </li>
              <li>
                <Link to="/offers">Offerte Speciali</Link>
              </li>
              <li>
                <Link to="/group-travel">Viaggi di Gruppo</Link>
              </li>
            </ul>
          </Col>

          {/* Colonna 3: Info Utili */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5>Info Utili</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/terms">Condizioni Generali</Link>
              </li>
              <li>
                <Link to="/travel-documents">Documenti di Viaggio</Link>
              </li>
              <li>
                <Link to="/payment-methods">Metodi di Pagamento</Link>
              </li>
              <li>
                <Link to="/travel-rules">Regole per Viaggiare</Link>
              </li>
            </ul>
          </Col>

          {/* Colonna 4: Seguici */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5>Seguici</h5>
            <div className="social-icons">
              <a
                href="https://facebook.com/travelmate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com/travelmate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com/travelmate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com/company/travelmate"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
            {/* Puoi aggiungere qui altri contatti o una breve descrizione */}
            <p className="mt-3">Il tuo partner ideale per ogni avventura.</p>
          </Col>
        </Row>

        <Row className="footer-bottom-text text-center">
          <Col>
            <p>
              &copy; {new Date().getFullYear()} Travel Mate. Tutti i diritti
              riservati.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
