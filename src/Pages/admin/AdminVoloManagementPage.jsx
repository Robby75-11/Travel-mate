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

import { getAllVoli, createVolo, updateVolo, deleteVolo } from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminVoloManagementPage() {
  const [voli, setVoli] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVolo, setCurrentVolo] = useState(null);
  const [formData, setFormData] = useState({
    // Campi per la gestione dei voli (es. numeroVolo, compagniaAerea, dataOraPartenza, dataOraArrivo, aeroportoPartenza, aeroportoArrivo, costoVolo)
    numeroVolo: "",
    compagniaAerea: "",
    dataOraPartenza: "",
    dataOraArrivo: "",
    aeroportoPartenza: "",
    aeroportoArrivo: "",
    costoVolo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Funzione per recuperare tutti i voli (simulata per ora)
  const fetchVoli = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVoli();
      setVoli(data);
    } catch (err) {
      console.error("Errore nel recuperare i voli:", err);
      setError("Impossibile caricare i voli. Accesso negato o errore di rete.");
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
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    fetchVoli();
  }, [isAuthenticated, userRole, navigate, fetchVoli]);

  // Gestione apertura/chiusura modale (placeholder)
  const handleShowModal = (volo = null) => {
    setCurrentVolo(volo);
    setFormData({
      numeroVolo: volo ? volo.numeroVolo : "",
      compagniaAerea: volo ? volo.compagniaAerea : "",
      dataOraPartenza: volo ? volo.dataOraPartenza.split("T")[0] : "", // Formatta per input type="date"
      dataOraArrivo: volo ? volo.dataOraArrivo.split("T")[0] : "", // Formatta per input type="date"
      aeroportoPartenza: volo ? volo.aeroportoPartenza : "",
      aeroportoArrivo: volo ? volo.aeroportoArrivo : "",
      costoVolo: volo ? volo.costoVolo : "",
    });
    setModalMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVolo(null);
    setFormData({
      numeroVolo: "",
      compagniaAerea: "",
      dataOraPartenza: "",
      dataOraArrivo: "",
      aeroportoPartenza: "",
      aeroportoArrivo: "",
      costoVolo: "",
    });
  };

  // Gestione input del form (placeholder)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestione salvataggio (aggiunta o modifica) volo (placeholder)
  const handleSaveVolo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage("");

    try {
      // Qui andrebbe la logica di createVolo o updateVolo
      let savedVolo;
      if (currentVolo) {
        savedVolo = await updateVolo(currentVolo.id, formData);
      } else {
        savedVolo = await createVolo(formData);
      }
      await fetchVoli(); // aggiorna la lista
      setModalMessage("Volo salvato con successo!");

      setModalMessage("Funzionalità di gestione voli in sviluppo!");
      // await fetchVoli();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      console.error("Errore nel salvare il volo:", err);
      setModalMessage(`Errore nel salvare il volo: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Gestione eliminazione volo (placeholder)
  const handleDeleteVolo = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo volo?")) {
      return;
    }
    setLoading(true);
    try {
      await deleteVolo(id);
      await fetchVoli();
    } catch (err) {
      console.error("Errore nell'eliminare il volo:", err);
      setError("Impossibile eliminare il volo. Riprova.");
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
        <p className="mt-2">Caricamento dati voli...</p>
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
      <h2 className="text-center mb-4">Gestione Voli (Admin)</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => handleShowModal()}>
          Aggiungi Nuovo Volo
        </Button>
      </div>

      {voli.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun volo presente. Funzionalità in sviluppo.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numero Volo</th>
              <th>Compagnia</th>
              <th>Partenza</th>
              <th>Arrivo</th>
              <th>Data/Ora Partenza</th>
              <th>Data/Ora Arrivo</th>
              <th>costoVolo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {voli.map((volo) => (
              <tr key={volo.id}>
                <td>{volo.id}</td>
                <td>{volo.numeroVolo}</td>
                <td>{volo.compagniaAerea}</td>
                <td>{volo.aeroportoPartenza}</td>
                <td>{volo.aeroportoArrivo}</td>
                <td>
                  {new Date(volo.dataOraPartenza).toLocaleString("it-IT")}
                </td>
                <td>{new Date(volo.dataOraArrivo).toLocaleString("it-IT")}</td>
                <td>€ {volo.costoVolo?.toFixed(2)}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(volo)}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteVolo(volo.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modale per Aggiungi/Modifica Volo */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentVolo ? "Modifica Volo" : "Aggiungi Nuovo Volo"}
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
          <Form onSubmit={handleSaveVolo}>
            <Form.Group className="mb-3" controlId="formNumeroVolo">
              <Form.Label>Numero Volo</Form.Label>
              <Form.Control
                type="text"
                name="numeroVolo"
                value={formData.numeroVolo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCompagniaAerea">
              <Form.Label>Compagnia Aerea</Form.Label>
              <Form.Control
                type="text"
                name="compagniaAerea"
                value={formData.compagniaAerea}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDataOraPartenza">
              <Form.Label>Data e Ora Partenza</Form.Label>
              <Form.Control
                type="datetime-local" // Usa datetime-local per data e ora
                name="dataOraPartenza"
                value={formData.dataOraPartenza}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDataOraArrivo">
              <Form.Label>Data e Ora Arrivo</Form.Label>
              <Form.Control
                type="datetime-local" // Usa datetime-local per data e ora
                name="dataOraArrivo"
                value={formData.dataOraArrivo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAeroportoPartenza">
              <Form.Label>Aeroporto Partenza</Form.Label>
              <Form.Control
                type="text"
                name="aeroportoPartenza"
                value={formData.aeroportoPartenza}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAeroportoArrivo">
              <Form.Label>Aeroporto Arrivo</Form.Label>
              <Form.Control
                type="text"
                name="aeroportoArrivo"
                value={formData.aeroportoArrivo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formcostoVolo">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="costoVolo"
                value={formData.costoVolo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Annulla
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Salvataggio...
                  </>
                ) : currentVolo ? (
                  "Salva Modifiche"
                ) : (
                  "Aggiungi Volo"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminVoloManagementPage;
