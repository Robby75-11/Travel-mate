import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { getViaggioById, uploadViaggioImage } from "../api.js";

function ViaggioDetailPage() {
  const { id } = useParams();
  const [viaggio, setViaggio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchViaggioDetails = async () => {
      try {
        const data = await getViaggioById(id);
        setViaggio(data);
      } catch (err) {
        console.error("Errore nel recuperare i dettagli del viaggio:", err);
        setError(
          "Impossibile caricare i dettagli del viaggio. Riprova più tardi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchViaggioDetails();
  }, [id]);

  const handleImageUpload = async () => {
    if (!selectedFiles.length) return;

    const file = selectedFiles[0];
    setUploading(true);

    try {
      const updatedViaggio = await uploadViaggioImage(id, file);
      setViaggio(updatedViaggio);
      setSelectedFiles([]);
    } catch (err) {
      alert("Errore durante l'upload dell'immagine.");
      console.error(err);
    } finally {
      setUploading(false);
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

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!viaggio) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          Viaggio non trovato.
        </Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/viaggi" variant="secondary">
            Torna alla lista viaggi
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4">{viaggio.nome}</h2>

              {viaggio.immagineUrl && (
                <div className="text-center mb-4">
                  <img
                    src={viaggio.immagineUrl}
                    alt={`Immagine di ${viaggio.nome}`}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "400px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </div>
              )}

              <p className="lead text-muted text-center">
                {viaggio.destinazione}
              </p>
              <hr />
              <p>{viaggio.descrizione}</p>
              <hr />
              <h4 className="text-primary text-center mb-4">
                Prezzo: € {viaggio.prezzo?.toFixed(2)}
              </h4>

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <Button
                  as={Link}
                  to={`/book-trip/${viaggio.id}`}
                  variant="primary"
                  size="lg"
                >
                  Prenota Ora
                </Button>
                <Button
                  as={Link}
                  to="/trips"
                  variant="outline-secondary"
                  size="lg"
                >
                  Torna alla lista viaggi
                </Button>
                <Button
                  as={Link}
                  to={`/recensioni/viaggio/${viaggio.id}`}
                  variant="info"
                  size="lg"
                >
                  Leggi / Scrivi Recensioni
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViaggioDetailPage;
