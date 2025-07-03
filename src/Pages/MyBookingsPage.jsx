import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { getUserBookings, cancelBooking } from "../api.js"; // Importa le funzioni API
import { useAuth } from "../contexts/AuthContext.jsx"; // Importa il contesto di autenticazione
import CardPrenotazione from "../Components/CardPrenotazione.jsx"; // NUOVA IMPORTAZIONE: CardPrenotazione
import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]); // Stato per le prenotazioni dell'utente
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori di caricamento
  const [cancelMessage, setCancelMessage] = useState(""); // Stato per i messaggi di annullamento
  const [isCancelError, setIsCancelError] = useState(false); // Stato per il tipo di messaggio di annullamento

  const { isAuthenticated } = useAuth(); // Ottieni lo stato di autenticazione
  const navigate = useNavigate(); // Hook per la navigazione

  // Funzione per recuperare le prenotazioni dell'utente
  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCancelMessage(""); // Resetta i messaggi di annullamento

    if (!isAuthenticated) {
      setError("Devi essere loggato per vedere le tue prenotazioni.");
      setLoading(false);
      // Reindirizza al login dopo un breve ritardo se non autenticato
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const data = await getUserBookings(); // Chiama l'API per ottenere le prenotazioni
      setBookings(data);
    } catch (err) {
      console.error("Errore nel recuperare le prenotazioni:", err);
      setError("Impossibile caricare le tue prenotazioni. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]); // Dipendenze: si aggiorna se lo stato di autenticazione cambia

  // Effetto per chiamare la funzione di recupero prenotazioni al mount e quando lo stato di auth cambia
  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]); // Dipendenza: la funzione fetchUserBookings stessa

  // Funzione per gestire l'annullamento di una prenotazione
  const handleCancelBooking = async (bookingId) => {
    setCancelMessage("");
    setIsCancelError(false);
    if (!window.confirm("Sei sicuro di voler annullare questa prenotazione?")) {
      return; // L'utente ha annullato la conferma
    }

    try {
      await cancelBooking(bookingId); // Chiama l'API per annullare la prenotazione
      setCancelMessage("Prenotazione annullata con successo!");
      setIsCancelError(false);
      // Ricarica le prenotazioni per riflettere l'annullamento
      fetchUserBookings();
    } catch (err) {
      console.error("Errore nell'annullare la prenotazione:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Errore nell'annullare la prenotazione. Riprova.";
      setCancelMessage(errorMessage);
      setIsCancelError(true);
    }
  };

  // Gestione dello stato di caricamento
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento prenotazioni...</span>
        </Spinner>
        <p className="mt-2">Caricamento delle tue prenotazioni...</p>
      </Container>
    );
  }

  // Gestione degli errori di caricamento
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        {!isAuthenticated && (
          <div className="text-center mt-3">
            <Button variant="primary" onClick={() => navigate("/login")}>
              Vai al Login
            </Button>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Le Mie Prenotazioni</h2>
      {/* Mostra messaggi di annullamento */}
      {cancelMessage && (
        <Alert
          variant={isCancelError ? "danger" : "success"}
          className="text-center"
        >
          {cancelMessage}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          Non hai ancora effettuato prenotazioni.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {" "}
          {/* Griglia responsiva per le card */}
          {bookings.map((booking) => (
            <Col key={booking.id}>
              {/* Passa l'intero oggetto booking (PrenotazioneResponseDto) al nuovo componente */}
              <CardPrenotazione
                prenotazione={booking}
                onCancelBooking={handleCancelBooking}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyBookingsPage;
