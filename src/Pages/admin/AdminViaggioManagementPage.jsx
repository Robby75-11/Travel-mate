// src/Pages/admin/AdminViaggioManagementPage.jsx
import react, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
// Assicurati di avere uploadViaggioImage in api.js
import {
  getAllViaggi,
  createViaggio,
  updateViaggio,
  deleteViaggio,
  uploadViaggioImage,
} from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminViaggioManagementPage() {
  const [viaggi, setViaggi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Stato per mostrare/nascondere il modale
  const [currentViaggio, setCurrentViaggio] = useState(null); // Viaggio attualmente in modifica (null per nuovo)
  const [formData, setFormData] = useState({
    // Stato per i dati del form del modale
    destinazione: "",
    dataPartenza: "",
    dataRitorno: "",
    descrizione: "",
    costoViaggio: "",
    immaginePrincipale: "", // Campo per l'URL dell'immagine esistente
  });
  const [imageFile, setImageFile] = useState(null); // Stato per il file immagine da caricare
  const [submitting, setSubmitting] = useState(false); // Stato per l'invio del form
  const [modalMessage, setModalMessage] = useState(""); // Messaggi nel modale

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Funzione per recuperare tutti i viaggi
  const fetchViaggi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllViaggi(); // Ora restituisce List<ViaggioResponseDto>
      setViaggi(data);
    } catch (err) {
      console.error("Errore nel recuperare i viaggi:", err);
      setError(
        "Impossibile caricare i viaggi. Accesso negato o errore di rete."
      );
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
    fetchViaggi();
  }, [isAuthenticated, userRole, navigate, fetchViaggi]);

  // Gestione apertura/chiusura modale
  const handleShowModal = (viaggio = null) => {
    setCurrentViaggio(viaggio);
    setFormData({
      destinazione: viaggio ? viaggio.destinazione : "",
      // Formatta le date per l'input type="date" (solo la parte YYYY-MM-DD)
      dataPartenza:
        viaggio && viaggio.dataPartenza
          ? viaggio.dataPartenza.split("T")[0]
          : "",
      dataRitorno:
        viaggio && viaggio.dataRitorno ? viaggio.dataRitorno.split("T")[0] : "",
      descrizione: viaggio ? viaggio.descrizione : "",
      costoViaggio: viaggio ? viaggio.costoViaggio : "",
      immaginePrincipale: viaggio ? viaggio.immaginePrincipale : "", // Popola l'URL esistente
    });
    setImageFile(null); // Resetta il file immagine
    setModalMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentViaggio(null);
    setFormData({
      destinazione: "",
      dataPartenza: "",
      dataRitorno: "",
      descrizione: "",
      costoViaggio: "",
      immaginePrincipale: "",
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

  // Gestione salvataggio (aggiunta o modifica) viaggio
  const handleSaveViaggio = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage("");

    try {
      // I campi di formData corrispondono ai campi dell'entità Viaggio
      let viaggioDataToSend = {
        destinazione: formData.destinazione,
        dataPartenza: formData.dataPartenza,
        dataRitorno: formData.dataRitorno,
        descrizione: formData.descrizione,
        costoViaggio: parseFloat(formData.costoViaggio),
      };

      let savedViaggio; // Questo sarà un ViaggioResponseDto
      if (currentViaggio) {
        // Modifica viaggio esistente
        viaggioDataToSend.id = currentViaggio.id;
        savedViaggio = await updateViaggio(
          currentViaggio.id,
          viaggioDataToSend
        );
      } else {
        // Crea nuovo viaggio
        savedViaggio = await createViaggio(viaggioDataToSend);
      }

      // Se c'è un file immagine, caricalo
      if (imageFile) {
        await uploadViaggioImage(savedViaggio.id, imageFile);
      }

      setModalMessage("Viaggio salvato con successo!");
      await fetchViaggi(); // Ricarica la lista dei viaggi
      setTimeout(() => handleCloseModal(), 1500); // Chiudi il modale dopo un breve ritardo
    } catch (err) {
      console.error("Errore nel salvare il viaggio:", err);
      setModalMessage(`Errore nel salvare il viaggio: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Gestione eliminazione viaggio
  const handleDeleteViaggio = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo viaggio?")) {
      return;
    }
    setLoading(true); // Mostra lo spinner mentre elimina
    try {
      await deleteViaggio(id);
      await fetchViaggi(); // Ricarica la lista
    } catch (err) {
      console.error("Errore nell'eliminare il viaggio:", err);
      setError("Impossibile eliminare il viaggio. Riprova.");
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
        <p className="mt-2">Caricamento dati viaggi...</p>
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
      <h2 className="text-center mb-4">Gestione Viaggi (Admin)</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => handleShowModal()}>
          Aggiungi Nuovo Viaggio
        </Button>
      </div>

      {viaggi.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun viaggio presente. Aggiungine uno!
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Destinazione</th>
              <th>Partenza</th>
              <th>Ritorno</th>
              <th>costoViaggio</th>
              <th>Immagine</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {viaggi.map((viaggio) => (
              <tr key={viaggio.id}>
                <td>{viaggio.id}</td>
                <td>{viaggio.destinazione}</td>
                {/* Formatta le date per la visualizzazione */}
                <td>
                  {viaggio.dataPartenza
                    ? new Date(viaggio.dataPartenza).toLocaleDateString("it-IT")
                    : "N/A"}
                </td>
                <td>
                  {viaggio.dataRitorno
                    ? new Date(viaggio.dataRitorno).toLocaleDateString("it-IT")
                    : "N/A"}
                </td>
                <td>€ {viaggio.costoViaggio.toFixed(2)}</td>
                <td>
                  {viaggio.immaginePrincipale ? (
                    <img
                      src={viaggio.immaginePrincipale}
                      alt={viaggio.destinazione}
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
                    onClick={() => handleShowModal(viaggio)}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteViaggio(viaggio.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modale per Aggiungi/Modifica Viaggio */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentViaggio ? "Modifica Viaggio" : "Aggiungi Nuovo Viaggio"}
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
          <Form onSubmit={handleSaveViaggio}>
            <Form.Group className="mb-3" controlId="formDestinazione">
              <Form.Label>Destinazione</Form.Label>
              <Form.Control
                type="text"
                name="destinazione"
                value={formData.destinazione}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDataPartenza">
              <Form.Label>Data Partenza</Form.Label>
              <Form.Control
                type="date"
                name="dataPartenza"
                value={formData.dataPartenza}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDataRitorno">
              <Form.Label>Data Ritorno</Form.Label>
              <Form.Control
                type="date"
                name="dataRitorno"
                value={formData.dataRitorno}
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
            <Form.Group className="mb-3" controlId="formPrezzo">
              <Form.Label>costoViaggio</Form.Label>
              <Form.Control
                type="number"
                name="costoViaggio"
                value={formData.prezzo}
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
                "Salva Viaggio"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminViaggioManagementPage;
