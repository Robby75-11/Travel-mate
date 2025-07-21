import { useEffect, useState } from "react";
import { getAllRecensioni, deleteRecensione } from "../../api";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const AdminGestioneRecensioniPage = () => {
  const [recensioni, setRecensioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    fetchRecensioni();
  }, []);

  const fetchRecensioni = async () => {
    try {
      const data = await getAllRecensioni();
      setRecensioni(data);
    } catch (err) {
      setErrore("Errore nel recupero delle recensioni.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa recensione?"))
      return;
    try {
      await deleteRecensione(id);
      setRecensioni((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Errore durante l'eliminazione della recensione.");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (errore) return <Alert variant="danger">{errore}</Alert>;

  return (
    <div className="container mt-4">
      <h2>Gestione Recensioni</h2>
      {recensioni.length === 0 ? (
        <Alert variant="info">Nessuna recensione trovata.</Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Utente</th>
              <th>Tipo</th>
              <th>Destinazione</th>
              <th>Valutazione</th>
              <th>Commento</th>
              <th>Data</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {recensioni.map((rec, idx) => (
              <tr key={rec.id}>
                <td>{idx + 1}</td>
                <td>
                  {rec.utenteNome || "N/D"} {rec.utenteCognome || ""}
                </td>
                <td>{rec.tipo || "N/D"}</td>
                <td>{rec.destinazioneNome || "N/D"}</td>
                <td>{rec.valutazione}</td>
                <td>{rec.contenuto || "N/D"}</td>
                <td>
                  {rec.dataCreazione
                    ? new Date(rec.dataCreazione).toLocaleDateString()
                    : "N/D"}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(rec.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminGestioneRecensioniPage;
