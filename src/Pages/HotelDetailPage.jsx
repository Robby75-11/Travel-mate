import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // useParams per l'ID dall'URL, Link per navigazione
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
import { getHotelById, uploadHotelImage } from "../api.js"; // Importa la funzione API per recuperare un singolo hotel

function HotelDetailPage() {
  const { id } = useParams(); // Ottiene l'ID dell'hotel dall'URL (es. /hotels/123 -> id = "123")
  const [hotel, setHotel] = useState(null); // Stato per i dettagli dell'hotel
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!selectedFiles.length) return;

    const file = selectedFiles[0]; // Prendiamo il primo file selezionato
    setUploading(true);

    try {
      const updatedHotel = await uploadHotelImage(id, file);
      setHotel(updatedHotel); // Aggiorna l’hotel con la nuova immagine
      setSelectedFiles([]); // Reset del file selezionato
    } catch (err) {
      alert("Errore durante l'upload dell'immagine.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const data = await getHotelById(id); // Chiama l'API per ottenere i dettagli dell'hotel
        setHotel(data);
      } catch (err) {
        console.error("Errore nel recuperare i dettagli dell'hotel:", err);
        setError(
          "Impossibile caricare i dettagli dell'hotel. Riprova più tardi."
        );
      } finally {
        setLoading(false); // Imposta loading a false indipendentemente dal successo o fallimento
      }
    };

    fetchHotelDetails(); // Esegue la funzione di recupero dati al mount del componente
  }, [id]); // Dipendenza: l'effetto si riesegue se l'ID dell'hotel nell'URL cambia

  // Gestione dello stato di caricamento
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

  // Se l'hotel non è stato trovato dopo il caricamento
  if (!hotel) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          Hotel non trovato.
        </Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/hotels" variant="secondary">
            Torna alla lista hotel
          </Button>
        </div>
      </Container>
    );
  }

  // Renderizzazione dei dettagli dell'hotel
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4">{hotel.nome}</h2>

              {/* Immagine dell'Hotel */}
              {hotel.immagineUrl && (
                <div className="text-center mb-4">
                  <img
                    src={hotel.immagineUrl}
                    alt={`Immagine di ${hotel.nome}`}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "400px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </div>
              )}

              <p className="lead text-muted text-center">{hotel.indirizzo}</p>
              <hr />
              <p>{hotel.descrizione}</p>
              <hr />
              <h4 className="text-primary text-center mb-4">
                PrezzoNotte: € {hotel.prezzoNotte?.toFixed(2)}
              </h4>

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <Button
                  as={Link}
                  to={`/book-hotel/${hotel.id}`}
                  variant="primary"
                  size="lg"
                >
                  Prenota Ora
                </Button>
                <Button
                  as={Link}
                  to="/hotels"
                  variant="outline-secondary"
                  size="lg"
                >
                  Torna alla lista hotel
                </Button>
                <Button
                  as={Link}
                  to={`/recensioni/hotel/${hotel.id}`}
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

export default HotelDetailPage;
