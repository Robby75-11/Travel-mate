import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getRecensioniByTipoAndId, createRecensione } from "../api";

const RecensionePage = () => {
  const { currentUser } = useAuth(); // utente corrente dal contesto di autenticazione
  const { tipo, id } = useParams();
  const [recensioni, setRecensioni] = useState([]);
  const [contenuto, setContenuto] = useState("");
  const [valutazione, setValutazione] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchRecensioni = async () => {
    try {
      setLoading(true);
      const data = await getRecensioniByTipoAndId(tipo, id);
      setRecensioni(data);
    } catch (err) {
      setError(err.message || "Errore nel caricamento delle recensioni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecensioni();
  }, [tipo, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postEndpoint = `/recensioni/${tipo}`;
      const reviewBody = {
        contenuto,
        valutazione,
        [tipo]: { id: parseInt(id) }, // es. { hotel: { id: 1 } }
      };

      await createRecensione(tipo, reviewBody);

      setContenuto("");
      setValutazione(5);
      setSuccess(true);
      await fetchRecensioni();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Errore durante l'invio della recensione"
      );
    }
  };

  const capitalizedTipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

  const renderStars = (valutazione) => {
    return "★".repeat(valutazione) + "☆".repeat(8 - valutazione);
  };
  const getLegenda = (media) => {
    if (media >= 7.5) return "Eccellente";
    if (media >= 5) return "Buono";
    if (media >= 3) return "Sufficiente";
    if (media > 0) return "Scarsa";
    return "Nessuna valutazione";
  };

  const haGiaRecensito =
    currentUser && recensioni.some((rec) => rec.utenteId === currentUser.id);

  const mediaValutazioni =
    recensioni.length > 0
      ? recensioni.reduce((acc, r) => acc + r.valutazione, 0) /
        recensioni.length
      : null;

  return (
    <div className="container mt-4">
      <h2>Recensioni del {capitalizedTipo}</h2>

      {mediaValutazioni && (
        <>
          <div className="text-center mb-4">
            <h5 className="mb-1">
              Valutazione media: {mediaValutazioni.toFixed(1)} / 8 –{" "}
              <strong>{getLegenda(mediaValutazioni)}</strong>
            </h5>
            <div style={{ fontSize: "1.5rem", color: "#ffc107" }}>
              {"★".repeat(Math.round(mediaValutazioni))}
              {"☆".repeat(8 - Math.round(mediaValutazioni))}
            </div>
          </div>

          <div className="text-center mb-4">
            <small className="text-muted d-block">
              <strong>Legenda:</strong>
            </small>
            <small className="text-muted d-block">
              ⭐⭐⭐⭐⭐⭐ 7.5–8 → Eccellente
            </small>
            <small className="text-muted d-block">⭐⭐⭐⭐ 5–7.4 → Buono</small>
            <small className="text-muted d-block">
              ⭐⭐⭐ 3–4.9 → Sufficiente
            </small>
            <small className="text-muted d-block">⭐⭐ 1–2.9 → Scarsa</small>
          </div>
        </>
      )}

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
                    <span
                      className="ms-3 text-warning"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {renderStars(rec.valutazione)}★ {rec.valutazione}
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
              Hai già recensito questo {tipo}. Grazie!
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit} className="mt-4">
              <h5>Scrivi una recensione</h5>

              {success && (
                <div
                  className="alert alert-success fade show text-center mt-3"
                  role="alert"
                >
                  🎉 Recensione inviata con successo!
                </div>
              )}

              <Form.Group>
                <Form.Label>Valutazione (1-8)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={8}
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
