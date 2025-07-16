import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getVoloById, prenotaVolo } from "../api.js";

function VoloBookingPage() {
  const { id } = useParams(); // ID volo da URL
  const [volo, setVolo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [numeroPasseggeri, setNumeroPasseggeri] = useState(1);
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
      const prezzoTotale =
        Number.isFinite(volo.costoVolo) && numeroPasseggeri
          ? volo.costoVolo * numeroPasseggeri
          : 0;

      await prenotaVolo({
        voloId: id,
        dataPrenotazione: new Date().toISOString().split("T")[0], // formato yyyy-MM-dd
        statoPrenotazione: "IN_ATTESA",
        destinazione: "Prenotazione volo",
        dataInizio: new Date().toISOString().split("T")[0],
        dataFine: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        prezzo: volo.costoVolo * numeroPasseggeri, // ✅ calcolo corretto
        numeroPasseggeri: parseInt(numeroPasseggeri), // ✅ invio al backend
      });

      setMessage("Prenotazione effettuata con successo!");
    } catch (err) {
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
        <strong>Prezzo per passeggero:</strong>{" "}
        {Number(volo?.costoVolo) > 0
          ? `€${Number(volo.costoVolo).toFixed(2)}`
          : "N/A"}
      </p>
      <p className="mt-2">
        <strong>Prezzo totale:</strong>{" "}
        {Number(volo?.costoVolo) > 0
          ? `€${(Number(volo.costoVolo) * numeroPasseggeri).toFixed(2)}`
          : "N/A"}
      </p>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="numeroPasseggeri">
          <Form.Label>Numero Passeggeri</Form.Label>
          <Form.Control
            type="number"
            value={numeroPasseggeri}
            onChange={(e) =>
              setNumeroPasseggeri(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
            max="10"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Prenotazione in corso..." : "Prenota ora"}
        </Button>
      </Form>
    </Container>
  );
}

export default VoloBookingPage;
