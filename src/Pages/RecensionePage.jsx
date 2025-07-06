import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";

const RecensionePage = ({ currentUser }) => {
  const { viaggioId } = useParams();
  const [recensioni, setRecensioni] = useState([]);
  const [contenuto, setContenuto] = useState("");
  const [valutazione, setValutazione] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchRecensioni = async () => {
    try {
      const response = await fetch(`/api/recensioni/viaggio/${viaggioId}`);
      if (!response.ok)
        throw new Error("Errore nel caricamento delle recensioni");
      const data = await response.json();
      setRecensioni(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecensioni();
  }, [viaggioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recensioni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}` se serve
        },
        body: JSON.stringify({
          contenuto,
          valutazione,
          utenteId: currentUser.id,
          viaggioId: viaggioId,
        }),
      });

      if (!response.ok)
        throw new Error("Errore durante l'invio della recensione");

      setContenuto("");
      setValutazione(5);
      setSubmitted(true);
      fetchRecensioni(); // aggiorna la lista
    } catch (err) {
      setError(err.message);
    }
  };

  const haGiaRecensito =
    currentUser && recensioni.some((rec) => rec.utenteId === currentUser.id);

  return (
    <div className="container mt-4">
      <h2>Recensioni del Viaggio</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {recensioni.length === 0 ? (
            <p>Nessuna recensione ancora.</p>
          ) : (
            recensioni.map((rec) => (
              <Card key={rec.id} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {rec.utenteNome} {rec.utenteCognome}
                    <span className="ms-3 text-warning">
                      ★ {rec.valutazione}
                    </span>
                  </Card.Title>
                  <Card.Text>{rec.contenuto}</Card.Text>
                  <small className="text-muted">
                    Inviata il {rec.dataCreazione}
                  </small>
                </Card.Body>
              </Card>
            ))
          )}

          {!currentUser ? (
            <Alert variant="info">
              Devi effettuare il login per scrivere una recensione.
            </Alert>
          ) : haGiaRecensito ? (
            <Alert variant="success">
              Hai già recensito questo viaggio. Grazie!
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit} className="mt-4">
              <h5>Scrivi una recensione</h5>
              <Form.Group>
                <Form.Label>Valutazione (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={5}
                  value={valutazione}
                  onChange={(e) => setValutazione(Number(e.target.value))}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Contenuto</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={contenuto}
                  onChange={(e) => setContenuto(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-3">
                Invia Recensione
              </Button>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default RecensionePage;
