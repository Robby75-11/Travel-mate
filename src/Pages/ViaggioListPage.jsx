// src/Pages/ViaggioListPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { getAllViaggi } from "../api.js"; // Importa la funzione API per recuperare i viaggi
import CardViaggio from "../Components/CardViaggio.jsx"; // Importa il componente CardViaggio

function ViaggioListPage() {
  const [viaggi, setViaggi] = useState([]); // Stato per la lista dei viaggi
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori

  useEffect(() => {
    const fetchViaggi = async () => {
      try {
        const data = await getAllViaggi(); // Chiama l'API per ottenere tutti i viaggi
        setViaggi(data);
      } catch (err) {
        setError("Impossibile caricare i viaggi. Riprova più tardi.");
      } finally {
        setLoading(false); // Imposta loading a false indipendentemente dal successo o fallimento
      }
    };

    fetchViaggi(); // Esegui la funzione di recupero dati al mount del componente
  }, []); // L'array vuoto assicura che l'effetto si esegua solo una volta al mount

  // Gestione dello stato di caricamento
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento viaggi...</span>
        </Spinner>
        <p className="mt-2">Caricamento dei viaggi disponibili...</p>
      </Container>
    );
  }

  // Gestione degli errori
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Le Nostre Proposte di Viaggio</h2>
      {viaggi.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun viaggio trovato al momento.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {" "}
          {/* Griglia responsiva per le card */}
          {viaggi.map((viaggio) => (
            <Col key={viaggio.id}>
              {" "}
              {/* Ogni card in una colonna per il layout a griglia */}
              <CardViaggio viaggio={viaggio} />{" "}
              {/* Renderizza il componente CardViaggio per ogni viaggio */}
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ViaggioListPage;
