import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
// Non abbiamo ancora un'API per i voli, quindi per ora simuliamo il caricamento
// import { getAllVoli } from '../api.js';

function VoloListPage() {
  const [voli, setVoli] = useState([]); // Stato per la lista dei voli
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori

  useEffect(() => {
    const fetchVoli = async () => {
      setLoading(true);
      setError(null);
      try {
        // SIMULAZIONE: In un'applicazione reale, qui faresti una chiamata API:
        // const data = await getAllVoli();
        // setVoli(data);

        // Per ora, simuliamo un ritardo e nessun dato
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setVoli([]); // Nessun volo trovato per ora
      } catch (err) {
        console.error("Errore nel recuperare i voli:", err);
        setError("Impossibile caricare i voli. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchVoli();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento voli...</span>
        </Spinner>
        <p className="mt-2">Caricamento dei voli disponibili...</p>
      </Container>
    );
  }

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
      <h2 className="text-center mb-4">I Nostri Voli Disponibili</h2>
      {voli.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun volo trovato al momento. Torna presto!
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* Qui andrebbero i componenti CardVolo se li avessi */}
          {/* {voli.map((volo) => (
            <Col key={volo.id}>
              <CardVolo volo={volo} />
            </Col>
          ))} */}
        </Row>
      )}
    </Container>
  );
}

export default VoloListPage;
