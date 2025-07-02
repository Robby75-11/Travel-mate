import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { getAllHotels } from "../api.js"; // Importa la funzione API per recuperare gli hotel
import CardHotel from "../Components/CardHotel.jsx"; // Importa il componente CardHotel (ora con carosello)

function HotelListPage() {
  const [hotels, setHotels] = useState([]); // Stato per la lista degli hotel
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels(); // Chiama l'API per ottenere tutti gli hotel
        // CORREZIONE: Assicurati che 'data' sia un array. Se non lo è, usa un array vuoto.
        setHotels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Errore nel recuperare gli hotel:", err);
        setError("Impossibile caricare gli hotel. Riprova più tardi.");
        setHotels([]); // Imposta a un array vuoto anche in caso di errore per evitare problemi con .map
      } finally {
        setLoading(false); // Imposta loading a false indipendentemente dal successo o fallimento
      }
    };

    fetchHotels(); // Esegui la funzione di recupero dati al mount del componente
  }, []); // L'array vuoto assicura che l'effetto si esegua solo una volta al mount

  // Gestione dello stato di caricamento
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento hotel...</span>
        </Spinner>
        <p className="mt-2">Caricamento degli hotel disponibili...</p>
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
      <h2 className="text-center mb-4">I Nostri Hotel e Resort</h2>
      {hotels.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun hotel trovato al momento.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {" "}
          {/* Griglia responsiva per le card */}
          {hotels.map((hotel) => (
            <Col key={hotel.id}>
              {" "}
              {/* Ogni card in una colonna per il layout a griglia */}
              {/* CardHotel ora gestisce il carosello delle immagini al suo interno */}
              <CardHotel hotel={hotel} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default HotelListPage;
