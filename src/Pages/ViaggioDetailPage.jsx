import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Carousel,
} from "react-bootstrap";
import { getViaggioById } from "../api.js";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function ViaggioDetailPage() {
  const { id } = useParams();
  const [viaggio, setViaggio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePrenotaClick = () => {
    if (!isAuthenticated) {
      navigate("/login"); // Reindirizza al login
    } else {
      navigate(`/book-trip/${viaggio.id}`); // Vai alla pagina di prenotazione
    }
  };

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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
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
              <h2 className="text-center mb-4">
                {viaggio.nome || viaggio.destinazione}
              </h2>

              {/* Carosello immagini */}
              {viaggio.immaginiUrl && viaggio.immaginiUrl.length > 0 ? (
                <div className="text-center mb-4">
                  <Carousel>
                    {viaggio.immaginiUrl.map((url, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100 rounded"
                          src={url}
                          alt={`Slide ${index + 1}`}
                          style={{
                            maxHeight: "400px",
                            objectFit: "cover",
                          }}
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://via.placeholder.com/600x300?text=Immagine+non+disponibile")
                          }
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <img
                    src={
                      viaggio.immaginePrincipale ||
                      "https://via.placeholder.com/600x300?text=Viaggio"
                    }
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/600x300?text=Immagine+non+disponibile")
                    }
                    className="img-fluid rounded"
                    alt="Immagine del viaggio"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
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
                Prezzo: € {Number(viaggio.costoViaggio).toFixed(2)}
              </h4>

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <Button
                  onClick={handlePrenotaClick}
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
