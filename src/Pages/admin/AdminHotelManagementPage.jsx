import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
// PERCORSO CORRETTO: Risale di due livelli (da admin/ a Pages/, poi a src/) e poi entra in Api/Api.js
// NOTA: Se il tuo file api.js è direttamente in src/, il percorso dovrebbe essere '../../api.js'
// Ho mantenuto il percorso precedente '../../../Api/Api.js' basandomi sull'ultima versione fornita.
// Se hai spostato api.js in src/, correggi questa riga in: import { getAllHotels, createHotel, updateHotel, deleteHotel, uploadHotelImage } from '../../api.js';
import {
  getAllHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  uploadHotelImage,
} from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminHotelManagementPage() {
  const [hotels, setHotels] = useState([]); // Stato per la lista degli hotel
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per gli errori
  const [showModal, setShowModal] = useState(false); // Stato per mostrare/nascondere il modale
  const [currentHotel, setCurrentHotel] = useState(null); // Hotel attualmente in modifica (null per nuovo)
  const [formData, setFormData] = useState({
    // Stato per i dati del form del modale
    nome: "",
    indirizzo: "",
    descrizione: "",
    prezzoPerNotte: "",
    immagineUrl: "", // Campo per l'URL dell'immagine esistente
  });
  const [imageFile, setImageFile] = useState(null); // Stato per il file immagine da caricare
  const [submitting, setSubmitting] = useState(false); // Stato per l'invio del form
  const [modalMessage, setModalMessage] = useState(""); // Messaggi nel modale

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Funzione per recuperare tutti gli hotel
  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllHotels();
      // CORREZIONE: Assicurati che 'data' sia un array. Se non lo è, usa un array vuoto.
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Errore nel recuperare gli hotel:", err);
      setError(
        "Impossibile caricare gli hotel. Accesso negato o errore di rete."
      );
      setHotels([]); // Imposta a un array vuoto anche in caso di errore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "AMMINISTRATORE") {
      setError(
        "Accesso negato. Solo gli amministratori possono accedere a questa pagina."
      );
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000); // Reindirizza al login
      return;
    }
    fetchHotels();
  }, [isAuthenticated, userRole, navigate, fetchHotels]);

  // Gestione apertura/chiusura modale
  const handleShowModal = (hotel = null) => {
    setCurrentHotel(hotel);
    setFormData({
      nome: hotel ? hotel.nome : "",
      indirizzo: hotel ? hotel.indirizzo : "",
      descrizione: hotel ? hotel.descrizione : "",
      prezzoPerNotte: hotel ? hotel.prezzoPerNotte : "",
      immagineUrl: hotel ? hotel.immagineUrl : "", // Popola l'URL esistente
    });
    setImageFile(null); // Resetta il file immagine
    setModalMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentHotel(null);
    setFormData({
      nome: "",
      indirizzo: "",
      descrizione: "",
      prezzoPerNotte: "",
      immagineUrl: "",
    });
    setImageFile(null);
  };

  // Gestione input del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestione selezione file immagine
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Gestione salvataggio (aggiunta o modifica) hotel
  const handleSaveHotel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage("");

    try {
      let hotelDataToSend = {
        nome: formData.nome,
        indirizzo: formData.indirizzo,
        descrizione: formData.descrizione,
        prezzoPerNotte: parseFloat(formData.prezzoPerNotte), // Assicurati che sia un numero
      };

      let savedHotel;
      if (currentHotel) {
        // Modifica hotel esistente
        hotelDataToSend.id = currentHotel.id; // Assicurati di inviare l'ID per l'update
        savedHotel = await updateHotel(currentHotel.id, hotelDataToSend);
      } else {
        // Crea nuovo hotel
        savedHotel = await createHotel(hotelDataToSend);
      }

      // Se c'è un file immagine, caricalo
      if (imageFile) {
        await uploadHotelImage(savedHotel.id, imageFile);
      }

      setModalMessage("Hotel salvato con successo!");
      await fetchHotels(); // Ricarica la lista degli hotel
      setTimeout(() => handleCloseModal(), 1500); // Chiudi il modale dopo un breve ritardo
    } catch (err) {
      console.error("Errore nel salvare l'hotel:", err);
      // MODIFICA QUI: Migliorata estrazione del messaggio di errore
      const errorMessage =
        err.response?.data?.message || err.message || err.toString();
      setModalMessage(`Errore nel salvare l'hotel: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Gestione eliminazione hotel
  const handleDeleteHotel = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo hotel?")) {
      return;
    }
    setLoading(true); // Mostra lo spinner mentre elimina
    try {
      await deleteHotel(id);
      await fetchHotels(); // Ricarica la lista
    } catch (err) {
      console.error("Errore nell'eliminare l'hotel:", err);
      setError("Impossibile eliminare l'hotel. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
        <p className="mt-2">Caricamento dati...</p>
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

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Gestione Hotel (Admin)</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => handleShowModal()}>
          Aggiungi Nuovo Hotel
        </Button>
      </div>

      {hotels.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun hotel presente. Aggiungine uno!
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Indirizzo</th>
              <th>Prezzo/Notte</th>
              <th>Immagine</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.id}</td>
                <td>{hotel.nome}</td>
                <td>{hotel.indirizzo}</td>
                <td>€ {hotel.prezzoPerNotte?.toFixed(2)}</td>
                <td>
                  {hotel.immagineUrl ? (
                    <img
                      src={hotel.immagineUrl}
                      alt={hotel.nome}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(hotel)}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteHotel(hotel.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modale per Aggiungi/Modifica Hotel */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentHotel ? "Modifica Hotel" : "Aggiungi Nuovo Hotel"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage && (
            <Alert
              variant={modalMessage.includes("Errore") ? "danger" : "success"}
            >
              {modalMessage}
            </Alert>
          )}
          <Form onSubmit={handleSaveHotel}>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formIndirizzo">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                type="text"
                name="indirizzo"
                value={formData.indirizzo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescrizione">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrezzoPerNotte">
              <Form.Label>Prezzo per Notte</Form.Label>
              <Form.Control
                type="number"
                name="prezzoPerNotte"
                value={formData.prezzoPerNotte}
                onChange={handleChange}
                required
                step="0.01"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formImmagine">
              <Form.Label>Carica Immagine (opzionale)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {formData.immagineUrl && !imageFile && (
                <div className="mt-2">
                  <small>Immagine attuale:</small>
                  <img
                    src={formData.immagineUrl}
                    alt="Anteprima"
                    style={{
                      width: "100px",
                      height: "auto",
                      display: "block",
                      marginTop: "5px",
                    }}
                  />
                </div>
              )}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
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
                  Salvataggio...
                </>
              ) : (
                "Salva Hotel"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminHotelManagementPage;
