import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const { isAuthenticated, userRole, currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-success shadow-sm " data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-airplane-fill me-2"></i>{" "}
          {/* Icona dell'aereo di Bootstrap Icons */}
          Travel Mate
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/hotels">
              Hotel
            </Nav.Link>
            <Nav.Link as={Link} to="/flights">
              Voli
            </Nav.Link>
            <Nav.Link as={Link} to="/trips">
              Viaggi
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
