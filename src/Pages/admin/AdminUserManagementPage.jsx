// src/Pages/admin/AdminUserManagementPage.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Nav,
} from "react-bootstrap";
import { getAllUsers, updateUserRole, deleteUser } from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Stato per mostrare/nascondere il modale
  const [currentUser, setCurrentUser] = useState(null); // Utente attualmente in modifica
  const [newRole, setNewRole] = useState(""); // Nuovo ruolo da assegnare
  const [modalMessage, setModalMessage] = useState(""); // Messaggi nel modale
  const [submitting, setSubmitting] = useState(false); // Stato per l'invio del form

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Funzione per recuperare tutti gli utenti
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Errore nel recuperare gli utenti:", err);
      setError(
        "Impossibile caricare gli utenti. Accesso negato o errore di rete."
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
    fetchUsers();
  }, [isAuthenticated, userRole, navigate, fetchUsers]);

  // Gestione apertura/chiusura modale
  const handleShowModal = (user) => {
    setCurrentUser(user);
    setNewRole(user.ruolo); // Pre-popola con il ruolo attuale dell'utente
    setModalMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setNewRole("");
    setModalMessage("");
  };

  // Gestione input del form (solo per il ruolo)
  const handleChangeRole = (e) => {
    setNewRole(e.target.value);
  };

  // Gestione salvataggio ruolo utente
  const handleSaveRole = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalMessage("");

    if (!currentUser) return;

    try {
      // L'API updateUserRole si aspetta l'ID dell'utente e il nuovo ruolo come stringa
      await updateUserRole(currentUser.id, newRole);
      setModalMessage("Ruolo utente aggiornato con successo!");
      await fetchUsers(); // Ricarica la lista degli utenti
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      console.error("Errore nell'aggiornare il ruolo utente:", err);
      setModalMessage(`Errore nell'aggiornare il ruolo: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Gestione eliminazione utente
  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile."
      )
    ) {
      return;
    }
    setLoading(true); // Mostra lo spinner mentre elimina
    try {
      await deleteUser(id);
      await fetchUsers(); // Ricarica la lista
    } catch (err) {
      console.error("Errore nell'eliminare l'utente:", err);
      setError("Impossibile eliminare l'utente. Riprova.");
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
        <p className="mt-2">Caricamento dati utenti...</p>
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
      <h2 className="text-center mb-4">Gestione Utenti (Admin)</h2>
      {users.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nessun utente registrato.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Email</th>
              <th>Ruolo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.cognome}</td>
                <td>{user.email}</td>
                <td>{user.ruolo}</td>

                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(user)}
                  >
                    Modifica Ruolo
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modale per Modifica Ruolo Utente */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Modifica Ruolo Utente: {currentUser?.nome} {currentUser?.cognome}
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
          <Form onSubmit={handleSaveRole}>
            <Form.Group className="mb-3" controlId="formUserRole">
              <Form.Label>Ruolo</Form.Label>
              <Form.Control
                as="select" // Campo select per scegliere il ruolo
                name="newRole"
                value={newRole}
                onChange={handleChangeRole}
                required
              >
                <option value="ROLE_UTENTE">UTENTE</option>{" "}
                {/* I valori devono corrispondere all'enum del backend */}
                <option value="ROLE_AMMINISTRATORE">AMMINISTRATORE</option>
              </Form.Control>
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
                  />
                  Salvataggio...
                </>
              ) : (
                "Salva Ruolo"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminUserManagementPage;
