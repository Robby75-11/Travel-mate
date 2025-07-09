// src/Pages/ViaggioBookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams per l'ID del viaggio dall'URL
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { getViaggioById, createViaggioBooking } from "../api.js"; // Importa le funzioni API
import { useAuth } from "../contexts/AuthContext.jsx"; // Per verificare se l'utente è autenticato

function ViaggioBookingPage() {
  // Ottieni l'ID del viaggio dall'URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Verifica lo stato di autenticazione

  // Stato per i dettagli del viaggio
  const [viaggio, setViaggio] = useState(null);
  // Stato per i dati del form di prenotazione
  const [bookingData, setBookingData] = useState({
    dataInizio: "",
    dataFine: "",
    numPasseggeri: 1, // Valore predefinito
  });
  // Stati per la gestione del caricamento, messaggi e errori
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Effetto per caricare i dettagli del viaggio all'avvio del componente
  useEffect(() => {
    const fetchViaggioDetails = async () => {
      if (!isAuthenticated) {
        // Se l'utente non è autenticato, reindirizza al login
        setMessage("Devi essere loggato per prenotare un viaggio.");
        setIsError(true);
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const data = await getViaggioById(id);
        setViaggio(data);
        // Pre-popola le date se il viaggio ha date specifiche
        if (data.dataPartenza) {
          setBookingData((prev) => ({
            ...prev,
            dataInizio: data.dataPartenza.split("T")[0],
          }));
        }
        if (data.dataRitorno) {
          setBookingData((prev) => ({
            ...prev,
            dataFine: data.dataRitorno.split("T")[0],
          }));
        }
      } catch (err) {
        console.error("Errore nel recuperare i dettagli del viaggio:", err);
        setMessage(
          "Impossibile caricare i dettagli del viaggio. Riprova più tardi."
        );
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchViaggioDetails();
  }, [id, isAuthenticated, navigate]); // Dipendenze dell'effetto

  // Funzione per aggiornare lo stato del form al cambiamento degli input
  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

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
      bookingData.numPasseggeri < 1
    ) {
      setMessage("Per favore, compila tutti i campi obbligatori.");
      setIsError(true);
      setSubmitting(false);
      return;
    }
    if (new Date(bookingData.dataInizio) > new Date(bookingData.dataFine)) {
      setMessage(
        "La data di inizio non può essere successiva alla data di fine."
      );
      setIsError(true);
      setSubmitting(false);
      return;
    }

    try {
      // Prepara i dati per l'API di prenotazione
      const bookingPayload = {
        viaggioId: id,
        dataInizio: bookingData.dataInizio,
        dataFine: bookingData.dataFine,
        numPasseggeri: parseInt(bookingData.numPasseggeri, 10),
        destinazione: viaggio?.destinazione || "Prenotazione viaggio",
        statoPrenotazione: "IN_ATTESA",
        prezzo: viaggio?.costoViaggio || 0, //
      };

      await createViaggioBooking(bookingPayload);

      setMessage(
        "Prenotazione effettuata con successo! Reindirizzamento alle tue prenotazioni..."
      );
      setIsError(false);
      setTimeout(() => {
        navigate("/my-bookings"); // Reindirizza alla pagina delle prenotazioni dell'utente
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Errore nella prenotazione. Riprova.";
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
          <span className="visually-hidden">
            Caricamento dettagli viaggio...
          </span>
        </Spinner>
        <p className="mt-2">Caricamento dettagli viaggio...</p>
      </Container>
    );
  }

  if (!viaggio && !isError) {
    // Se non c'è viaggio e non c'è un errore specifico (es. non autenticato)
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          Viaggio non trovato.
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
          <h2 className="text-center mb-4">Prenota: {viaggio?.destinazione}</h2>
          {viaggio && (
            <div className="mb-4 text-center">
              {viaggio.immagineUrl && (
                <img
                  src={viaggio.immagineUrl}
                  alt={`Immagine di ${viaggio.destinazione}`}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              )}
              <h4>{viaggio.destinazione}</h4>
              <p>
                Dal {new Date(viaggio.dataPartenza).toLocaleDateString("it-IT")}{" "}
                al {new Date(viaggio.dataRitorno).toLocaleDateString("it-IT")}
              </p>
              <p>{viaggio.descrizione}</p>
              <h5 className="text-primary">
                Costo viaggio: €{" "}
                {(Number.isFinite(viaggio.costoViaggio)
                  ? viaggio.costoViaggio
                  : 0
                ).toFixed(2)}
              </h5>
            </div>
          )}

          {/* Mostra messaggi di errore o successo */}
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formDataInizio">
              <Form.Label>Data di Inizio</Form.Label>
              <Form.Control
                type="date"
                name="dataInizio"
                value={bookingData.dataInizio}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDataFine">
              <Form.Label>Data di Fine</Form.Label>
              <Form.Control
                type="date"
                name="dataFine"
                value={bookingData.dataFine}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNumPasseggeri">
              <Form.Label>Numero Passeggeri</Form.Label>
              <Form.Control
                type="number"
                name="numPasseggeri"
                value={bookingData.numPasseggeri}
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
                "Conferma Prenotazione"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ViaggioBookingPage;
