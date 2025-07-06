import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import CardVolo from "../Components/CardVolo";

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

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dati = [
          {
            id: 1,
            compagnia: "Compagnia A",
            partenza: "Milano",
            arrivo: "Roma",
            dataPartenza: "2023-10-01T10:00:00Z",
            dataArrivo: "2023-10-01T12:00:00Z",
          },
          {
            id: 2,
            compagnia: "Compagnia B",
            partenza: "Roma",
            arrivo: "Milano",
            dataPartenza: "2023-10-02T14:00:00Z",
            dataArrivo: "2023-10-02T16:00:00Z",
          },
        ];
        setVoli(dati);
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
          {voli.map((volo) => (
            <Col key={volo.id}>
              <CardVolo volo={volo} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default VoloListPage;
