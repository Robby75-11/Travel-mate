import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx"; // per verificare se l'utente è autenticato
import { getHotelById, createHotelBooking } from "../api.js"; // Importa la funzione API per ottenere gli hotel disponibili
import { useParams, useNavigate } from "react-router-dom"; // useParams per l'ID dell'hotel dall'URL
import { Card, Form, Button } from "react-bootstrap";

function HotelBookingPage() {
  //Id dell'hotel dall'URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Verifica lo stato di autenticazione

  //STATO PER I DETTAGLI DELL'HOTEL
  const [hotel, setHotel] = useState(null);
  //Stato per i dati del form di prenotazione
  const [bookingData, setBookingData] = useState({
    dataInizio: "",
    dataFine: "",
    numOspiti: 1,
  });
  //Stati per caricamento,  messaggi di errore o successo
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  //Effetto per caricare i dettagli dell'hotel
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!isAuthenticated) {
        // Se l'utente non è autenticato, reindirizza al login
        setMessage("Devi essere loggato per prenotare un hotel.");
        setIsError(true);
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const data = await getHotelById(id);
        setHotel(data);
        console.log("HOTEL DETTAGLI:", data); // <-- QUI
      } catch (err) {
        console.error("Errore nel recuperare i dettagli dell'hotel:", err);
        setMessage(
          "Impossibile caricare i dettagli dell'hotel. Riprova più tardi."
        );
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, isAuthenticated, navigate]); // Dipendenze dell'effetto

  // Funzione per aggiornare lo stato del form al cambiamento degli input
  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const giorni =
    (new Date(bookingData.dataFine) - new Date(bookingData.dataInizio)) /
    (1000 * 60 * 60 * 24);
  const prezzoTotale = giorni > 0 ? giorni * (hotel?.prezzoNotte || 0) : 0;

  // Funzione per gestire l'invio del form di prenotazione
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setSubmitting(true);

    // Validazione lato client
    if (
      !bookingData.dataInizio ||
      !bookingData.dataFine ||
      bookingData.numOspiti < 1
    ) {
      setMessage("Per favore, compila tutti i campi obbligatori.");
      setIsError(true);
      setSubmitting(false);
      return;
    }
    if (new Date(bookingData.dataInizio) > new Date(bookingData.dataFine)) {
      setMessage(
        "La data di check-in non può essere successiva alla data di check-out."
      );
      setIsError(true);
      setSubmitting(false);
      return;
    }
    try {
      // Prepara i dati per l'API di prenotazione hotel
      const bookingPayload = {
        hotelId: id, // ID dell'hotel
        dataInizio: bookingData.dataInizio,
        dataFine: bookingData.dataFine,
        statoPrenotazione: "IN_ATTESA",
        destinazione: `Hotel ${hotel?.nome || "Sconosciuto"}`,
        prezzo: prezzoTotale,
      };

      // Chiama la funzione di prenotazione hotel API (da aggiungere in api.js)

      await createHotelBooking(bookingPayload);

      setMessage(
        "Prenotazione hotel effettuata con successo! Reindirizzamento alle tue prenotazioni..."
      );
      setIsError(false);
      setTimeout(() => {
        navigate("/my-bookings"); // Reindirizza alla pagina delle prenotazioni dell'utente
      }, 2000);
    } catch (error) {
      console.error("Errore durante la prenotazione dell'hotel:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Errore nella prenotazione dell'hotel. Riprova.";
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento dettagli hotel...</span>
        </Spinner>
        <p className="mt-2">Caricamento dettagli hotel...</p>
      </Container>
    );
  }

  if (!hotel && !isError) {
    // Se non c'è hotel e non c'è un errore specifico (es. non autenticato)
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          Hotel non trovato.
        </Alert>
      </Container>
    );
  }

  // Renderizzazione del form di prenotazione
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-lg"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4">Prenota: {hotel?.nome}</h2>
          {hotel && (
            <div className="mb-4 text-center">
              {hotel.immaginePrincipale && (
                <img
                  src={hotel.immaginePrincipale}
                  alt={`Immagine di ${hotel.nome}`}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              )}
              <h4>{hotel.nome}</h4>
              <p className="text-muted">{hotel.indirizzo}</p>
              <p>{hotel.descrizione}</p>
              <h5 className="text-primary">
                Prezzo per notte: € {hotel.prezzoNotte?.toFixed(2) || "0.00"}
              </h5>
            </div>
          )}
          {bookingData.dataInizio && bookingData.dataFine && (
            <h5 className="text-success">
              Prezzo Totale: € {prezzoTotale.toFixed(2)}
            </h5>
          )}

          {/* Mostra messaggi di errore o successo */}
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formDataInizio">
              <Form.Label>Data Check-in</Form.Label>
              <Form.Control
                type="date"
                name="dataInizio"
                value={bookingData.dataInizio}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDataFine">
              <Form.Label>Data Check-out</Form.Label>
              <Form.Control
                type="date"
                name="dataFine"
                value={bookingData.dataFine}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNumOspiti">
              <Form.Label>Numero Ospiti</Form.Label>
              <Form.Control
                type="number"
                name="numOspiti"
                value={bookingData.numOspiti}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Prenotazione in corso...
                </>
              ) : (
                "Conferma Prenotazione Hotel"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HotelBookingPage;
