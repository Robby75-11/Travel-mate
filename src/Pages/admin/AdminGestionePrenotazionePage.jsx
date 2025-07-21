import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Modal, Form } from "react-bootstrap";
import {
  getAllPrenotazioni,
  deletePrenotazione,
  updatePrenotazione,
  inviaEmailConferma,
} from "../../api";

function AdminGestionePrenotazionePage() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({
    statoPrenotazione: "",
    messaggioEmail: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const fetchPrenotazioni = async () => {
    try {
      const data = await getAllPrenotazioni();
      setPrenotazioni(data);
    } catch (err) {
      setError("Errore nel caricamento prenotazioni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrenotazioni();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confermi eliminazione?")) return;
    await deletePrenotazione(id);
    fetchPrenotazioni();
  };

  const handleUpdateModal = (p) => {
    setCurrent(p);
    setFormData({
      statoPrenotazione: p.statoPrenotazione,
      messaggioEmail:
        "Gentile cliente, la tua prenotazione è stata confermata.",
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePrenotazione(current.id, {
        ...current,
        statoPrenotazione: formData.statoPrenotazione,
      });
      setMessage("Aggiornamento riuscito");
      fetchPrenotazioni();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setMessage("Errore aggiornamento");
    } finally {
      setSaving(false);
    }
  };

  const handleEmail = async (id, showInModal = true) => {
    setEmailSending(true);

    if (showInModal) {
      setMessage("📨 Invio email in corso...");
    } else {
      setMessage("📨 Invio email in corso...");
    }

    try {
      await inviaEmailConferma({
        idPrenotazione: id,
        testo: formData.messaggioEmail,
        oggetto: "Conferma Prenotazione",
      });

      if (showInModal) {
        setMessage("✅ Email inviata con successo!");
        setTimeout(() => {
          setShowModal(false);
          setMessage("");
          setCurrent(null);
        }, 2000);
      } else {
        setMessage("✅ Email inviata con successo!");
        // Mostra messaggio temporaneo in alto
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      const errorMsg = "❌ Errore nell'invio dell'email";
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3>Gestione Prenotazioni</h3>
      {message && (
        <Alert
          variant={
            message.includes("✅")
              ? "success"
              : message.includes("❌")
              ? "danger"
              : "info"
          }
          className="mt-3"
        >
          {message}
        </Alert>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Utente</th>
            <th>Email</th>
            <th>Destinazione</th>
            <th>Periodo</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {prenotazioni.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.utente ? `${p.utente.nome} ${p.utente.cognome}` : "-"}</td>

              <td>{p.utente ? p.utente.email : "-"}</td>
              <td>{p.destinazione || "-"}</td>
              <td>
                {p.dataInizio} - {p.dataFine}
              </td>
              <td>
                <span
                  className={`badge ${
                    p.statoPrenotazione === "CONFERMATA"
                      ? "bg-success"
                      : p.statoPrenotazione === "IN_ATTESA"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {p.statoPrenotazione}
                </span>
              </td>
              <td>
                <Button size="sm" onClick={() => handleUpdateModal(p)}>
                  Modifica
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Elimina
                </Button>{" "}
                {p.statoPrenotazione === "CONFERMATA" && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleEmail(p.id, false)}
                    disabled={emailSending}
                  >
                    Invia Email
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal per aggiornare stato */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prenotazione #{current?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && (
            <Alert
              variant={
                message.includes("✅")
                  ? "success"
                  : message.includes("❌")
                  ? "danger"
                  : "info"
              }
              className="mt-2"
            >
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Stato Prenotazione</Form.Label>
              <Form.Select
                name="statoPrenotazione"
                value={formData.statoPrenotazione}
                onChange={handleFormChange}
                required
              >
                <option value="">-- Seleziona --</option>
                <option value="IN_ATTESA">In Attesa</option>
                <option value="CONFERMATA">Confermata</option>
                <option value="ANNULLATA">Annullata</option>
              </Form.Select>
            </Form.Group>

            {formData.statoPrenotazione === "CONFERMATA" && (
              <Form.Group className="mt-3">
                <Form.Label>Messaggio Email</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="messaggioEmail"
                  value={formData.messaggioEmail}
                  onChange={handleFormChange}
                />
              </Form.Group>
            )}

            <Button type="submit" className="mt-3" disabled={saving}>
              {saving ? "Salvataggio..." : "Salva"}
            </Button>
            {formData.statoPrenotazione === "CONFERMATA" && (
              <Button
                type="button"
                variant="success"
                className="mt-3 ms-2"
                onClick={() => handleEmail(current.id)}
                disabled={emailSending}
              >
                {emailSending ? "Invio in corso..." : "Invia Email"}
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminGestionePrenotazionePage;
