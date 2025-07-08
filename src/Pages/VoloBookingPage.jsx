import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getVoloById, prenotaVolo } from "../api";

function VoloBookingPage() {
  const { id } = useParams(); // ID volo da URL
  const [volo, setVolo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchVolo = async () => {
      try {
        const data = await getVoloById(id);
        setVolo(data);
      } catch (err) {
        setError("Errore nel caricamento del volo");
      } finally {
        setLoading(false);
      }
    };
    fetchVolo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Devi essere loggato per prenotare un volo.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage("");
    try {
      const payload = {
        voloId: id,
        utenteId: user.id,
      };

      await prenotaVolo({
        voloId: id,
        utenteId: user.id,
      }); // ✅ chiamata corretta con oggetto

      setMessage("Prenotazione effettuata con successo!");
    } catch (err) {
      //  console.error("Errore durante la prenotazione:", err);
      setError("Errore durante la prenotazione. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Caricamento volo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Prenota il Volo</h2>
      <p>
        <strong>Numero volo:</strong> {volo.numeroVolo}
      </p>
      <p>
        <strong>Compagnia:</strong> {volo.compagniaAerea}
      </p>
      <p>
        <strong>Partenza:</strong>{" "}
        {new Date(volo.dataOraPartenza).toLocaleString()}
      </p>
      <p>
        <strong>Arrivo:</strong> {new Date(volo.dataOraArrivo).toLocaleString()}
      </p>
      <p>
        <strong>CostoVolo:</strong> €{" "}
        {typeof volo.costoVolo === "number"
          ? volo.costoVolo.toFixed(2)
          : "N.D."}
      </p>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Prenotazione in corso..." : "Prenota ora"}
        </Button>
      </Form>
    </Container>
  );
}

export default VoloBookingPage;
