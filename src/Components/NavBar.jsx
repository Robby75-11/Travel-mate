import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/agenzy.jpeg";
import hotelIcon from "../assets/download.png";
import {
  faPlane,
  faHouse,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const { isAuthenticated, userRole, currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="navbar-custom shadow-sm "
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo Travel Mate"
            width="42"
            height="42"
            className="me-2"
          />
          <strong>Travel Mate</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FontAwesomeIcon icon={faHouse} className="me-2 text-light" />{" "}
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/hotels">
              <img
                src={hotelIcon}
                alt="Hotel"
                width="28"
                height="28"
                className="me-2"
              />{" "}
              Hotel
            </Nav.Link>
            <Nav.Link as={Link} to="/flights">
              <FontAwesomeIcon icon={faPlane} className="me-2" /> Voli
            </Nav.Link>
            <Nav.Link as={Link} to="/trips">
              <FontAwesomeIcon icon={faSuitcaseRolling} className="me-2" />{" "}
              Viaggi
            </Nav.Link>
            <Nav.Link as={NavLink} to="/last-minute">
              <i className="bi bi-fire me-1 text-warning"></i> Last Minute
            </Nav.Link>
            {isAuthenticated && userRole === "AMMINISTRATORE" && (
              <NavDropdown title="Backoffice" id="backoffice-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/hotels">
                  Gestione Hotel
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">
                  Gestione Utenti
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/flights">
                  Gestione Voli
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/trips">
                  Gestione Viaggi
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/admin/bookings">
                  Gestione Prenotazioni
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/admin/reviews">
                  Gestione Recensioni
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-bookings">
                Le Mie Prenotazioni
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Accedi
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registrati
                </Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Text className="me-3">
                  {" "}
                  <strong>
                    {currentUser?.nome
                      ? `${currentUser.nome} ${currentUser.cognome}`
                      : currentUser?.email}
                  </strong>{" "}
                  ({userRole})
                </Navbar.Text>
                <Button variant="outline-light" onClick={onLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
