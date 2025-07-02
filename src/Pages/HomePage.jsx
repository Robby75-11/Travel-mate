import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"; // Importa useAuth per controllare lo stato di autenticazione

function HomePage() {
  const { isAuthenticated } = useAuth(); // Ottieni lo stato di autenticazione

  return (
    <Container className="mt-5">
      {/* Sezione Hero / Introduttiva */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={10} lg={8}>
          <h1 className="display-4 fw-bold mb-3">
            Trova la Tua Prossima Avventura con Travel Mate
          </h1>
          <p className="lead text-muted mb-4">
            Esplora destinazioni incredibili, prenota hotel, voli e viaggi
            organizzati. Il tuo viaggio inizia qui!
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button
              as={Link}
              to="/trips"
              variant="primary"
              size="lg"
              className="px-4 gap-3"
            >
              Esplora Viaggi
            </Button>
            <Button
              as={Link}
              to="/hotels"
              variant="outline-secondary"
              size="lg"
              className="px-4"
            >
              Cerca Hotel
            </Button>
          </div>
        </Col>
      </Row>

      {/* Sezione "Perché Sceglierci" */}
      <Row className="mb-5 text-center">
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-globe-americas fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Globe */}
              <Card.Title>Destinazioni Globali</Card.Title>
              <Card.Text>
                Un'ampia selezione di mete in tutto il mondo per ogni tipo di
                viaggiatore.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-wallet-fill fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Wallet */}
              <Card.Title>Prezzi Competitivi</Card.Title>
              <Card.Text>
                Offerte esclusive e tariffe vantaggiose per un viaggio senza
                pensieri.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-headset fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Headset */}
              <Card.Title>Supporto 24/7</Card.Title>
              <Card.Text>
                Assistenza clienti dedicata disponibile in ogni momento del tuo
                viaggio.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sezione Call to Action per Login/Registrazione (visibile solo se NON autenticato) */}
      {!isAuthenticated && ( // Mostra questa sezione solo se l'utente NON è autenticato
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <Card className="p-4 shadow-lg bg-light">
              <Card.Body>
                <h3 className="mb-3">Pronto a Partire?</h3>
                <p className="text-muted">
                  Accedi o registrati per gestire le tue prenotazioni e scoprire
                  offerte personalizzate.
                </p>
                <Button
                  as={Link}
                  to="/login"
                  variant="success"
                  size="lg"
                  className="me-2"
                >
                  Accedi
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-success"
                  size="lg"
                >
                  Registrati
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Puoi aggiungere altre sezioni qui, come:
          - Viaggi in evidenza (con CardViaggio)
          - Hotel popolari (con CardHotel)
          - Una barra di ricerca completa
      */}
    </Container>
  );
}

export default HomePage;
