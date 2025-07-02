import React from "react"; // Importa React
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button"; // Per il bottone di Logout
import { Link, useNavigate } from "react-router-dom"; // Importa Link e useNavigate da React Router DOM
import { useAuth } from "../contexts/AuthContext"; // Importa il tuo contesto di autenticazione

function NavBar() {
  // Destruttura le proprietà e le funzioni dal tuo AuthContext
  const { isAuthenticated, userRole, handleLogout } = useAuth();
  const navigate = useNavigate(); // Hook per la navigazione programmatica

  // *** RIGA DI DEBUG: INIZIO ***
  console.log("NavBar Debug - isAuthenticated:", isAuthenticated);
  console.log("NavBar Debug - userRole:", userRole);
  // *** RIGA DI DEBUG: FINE ***

  // Funzione per gestire il logout
  const onLogout = () => {
    handleLogout(); // Chiama la funzione di logout definita nel contesto
    navigate("/"); // Reindirizza l'utente alla home page dopo il logout
  };

  return (
    // CAMBIATO: da bg-body-tertiary a bg-primary per un colore di sfondo più deciso
    // Aggiunto data-bs-theme="dark" per rendere il testo e le icone della navbar chiare
    <Navbar expand="lg" className="bg-primary shadow-sm" data-bs-theme="dark">
      <Container>
        {/* Logo/Brand della Navbar, usa Link per navigare alla Home */}
        <Navbar.Brand as={Link} to="/">
          Travel Mate
        </Navbar.Brand>

        {/* Bottone per il toggle della Navbar su schermi piccoli */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenuto della Navbar collassabile */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* "me-auto" spinge gli elementi a destra */}
            {/* Link di navigazione principali */}
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
            {/* Dropdown "Backoffice" visibile solo agli amministratori */}
            {isAuthenticated && userRole === "AMMINISTRATORE" && (
              <NavDropdown title="Backoffice" id="backoffice-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/hotels">
                  Gestione Hotel
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">
                  Gestione Utenti
                </NavDropdown.Item>
                {/* Aggiungi qui altri link per la gestione di voli, viaggi, ecc. se ne hai */}
                <NavDropdown.Item as={Link} to="/admin/flights">
                  Gestione Voli
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/trips">
                  Gestione Viaggi
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {/* Link "Le Mie Prenotazioni" visibile solo agli utenti autenticati */}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-bookings">
                Le Mie Prenotazioni
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {/* Se l'utente NON è autenticato, mostra "Accedi" e "Registrati" */}
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
              // Se l'utente È autenticato, mostra il ruolo e il bottone "Logout"
              <>
                {/* CAMBIATO: rimosso text-dark, ora il testo sarà chiaro grazie a data-bs-theme="dark" */}
                <Navbar.Text className="me-3">
                  Loggato come: <strong>{userRole}</strong>
                </Navbar.Text>
                <Button variant="outline-light" onClick={onLogout}>
                  {" "}
                  {/* CAMBIATO: da outline-danger a outline-light per contrasto */}
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
