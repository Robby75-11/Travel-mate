// src/Pages/admin/AdminViaggioManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getAllViaggi,
  createViaggio,
  updateViaggio,
  deleteViaggio,
  uploadMultipleViaggioImages,
} from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminViaggioManagementPage() {
  const [viaggi, setViaggi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentViaggio, setCurrentViaggio] = useState(null);
  const [formData, setFormData] = useState({
    destinazione: "",
    dataPartenza: "",
    dataRitorno: "",
    descrizione: "",
    costoViaggio: "",
    immaginePrincipale: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchViaggi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllViaggi();
      setViaggi(data);
    } catch (err) {
      setError("Errore nel caricamento dei viaggi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "AMMINISTRATORE") {
      setError("Accesso negato.");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    fetchViaggi();
  }, [isAuthenticated, userRole, navigate, fetchViaggi]);

  const handleShowModal = (viaggio = null) => {
    setCurrentViaggio(viaggio);
    setFormData({
      destinazione: viaggio?.destinazione || "",
      dataPartenza: viaggio?.dataPartenza?.split("T")[0] || "",
      dataRitorno: viaggio?.dataRitorno?.split("T")[0] || "",
      descrizione: viaggio?.descrizione || "",
      costoViaggio: viaggio?.costoViaggio || "",
      immaginePrincipale: viaggio?.immaginePrincipale || "",
    });
    setSelectedFiles([]);
    setModalMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFiles([]);
    setCurrentViaggio(null);
    setFormData({
      destinazione: "",
      dataPartenza: "",
      dataRitorno: "",
      descrizione: "",
      costoViaggio: "",
      immaginePrincipale: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSaveViaggio = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage("");

    try {
      const viaggioDataToSend = {
        destinazione: formData.destinazione,
        dataPartenza: formData.dataPartenza,
        dataRitorno: formData.dataRitorno,
        descrizione: formData.descrizione,
        costoViaggio: parseFloat(formData.costoViaggio),
      };

      let savedViaggio;
      if (currentViaggio) {
        savedViaggio = await updateViaggio(
          currentViaggio.id,
          viaggioDataToSend
        );
      } else {
        savedViaggio = await createViaggio(viaggioDataToSend);
      }

      if (selectedFiles.length > 0) {
        await uploadMultipleViaggioImages(savedViaggio.id, selectedFiles);
      }

      setModalMessage("Viaggio salvato con successo!");
      await fetchViaggi();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setModalMessage(`Errore: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImages = async (viaggioId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        try {
          await uploadMultipleViaggioImages(viaggioId, files);
          await fetchViaggi();
          alert("Immagini caricate con successo");
        } catch (err) {
          alert("Errore nel caricamento immagini");
        }
      }
    };
    input.click();
  };

  const handleDeleteViaggio = async (id) => {
    if (!window.confirm("Confermi eliminazione del viaggio?")) return;
    setLoading(true);
    try {
      await deleteViaggio(id);
      await fetchViaggi();
    } catch {
      setError("Errore eliminazione viaggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Gestione Viaggi (Admin)</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => handleShowModal()}>
          Aggiungi Nuovo Viaggio
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : viaggi.length === 0 ? (
        <Alert variant="info">Nessun viaggio disponibile.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Destinazione</th>
              <th>Partenza</th>
              <th>Ritorno</th>
              <th>Costo</th>
              <th>Immagine</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {viaggi.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.destinazione}</td>
                <td>{new Date(v.dataPartenza).toLocaleDateString()}</td>
                <td>{new Date(v.dataRitorno).toLocaleDateString()}</td>
                <td>€ {v.costoViaggio.toFixed(2)}</td>
                <td>
                  {v.immaginePrincipale ? (
                    <img
                      src={v.immaginePrincipale}
                      alt={v.destinazione}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(v)}
                  >
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    className="me-2"
                    onClick={() => handleUploadImages(v.id)}
                  >
                    Carica Immagini
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteViaggio(v.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentViaggio ? "Modifica Viaggio" : "Nuovo Viaggio"}
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
            <Form.Group className="mb-3">
              <Form.Label>Destinazione</Form.Label>
              <Form.Control
                name="destinazione"
                value={formData.destinazione}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Partenza</Form.Label>
              <Form.Control
                type="date"
                name="dataPartenza"
                value={formData.dataPartenza}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Ritorno</Form.Label>
              <Form.Control
                type="date"
                name="dataRitorno"
                value={formData.dataRitorno}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Costo</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="costoViaggio"
                value={formData.costoViaggio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Immagini</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
              />
              {selectedFiles.length > 0 && (
                <div className="d-flex gap-2 mt-2">
                  {selectedFiles.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              )}
            </Form.Group>
            <Button type="submit" className="w-100" disabled={submitting}>
              {submitting ? "Salvataggio..." : "Salva Viaggio"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminViaggioManagementPage;
