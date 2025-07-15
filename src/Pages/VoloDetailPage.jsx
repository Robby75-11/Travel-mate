// Pages/VoloDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVoloById } from "../api";
import { Container, Spinner, Alert } from "react-bootstrap";

const VoloDetailPage = () => {
  const { id } = useParams();
  const [volo, setVolo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVoloById(id);
        setVolo(data);
      } catch (err) {
        setError("Errore nel caricamento del volo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Caricamento dettagli volo...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h2>Dettagli del Volo</h2>
      <p>
        <strong>Compagnia Aerea:</strong> {volo.compagniaAerea}
      </p>
      <p>
        <strong>Aeroporto Partenza:</strong> {volo.aeroportoPartenza}
      </p>
      <p>
        <strong>Aeroporto Arrivo:</strong> {volo.aeroportoArrivo}
      </p>
      <p>
        <strong>Partenza:</strong>{" "}
        {new Date(volo.dataOraPartenza).toLocaleString()}
      </p>
      <p>
        <strong>Arrivo:</strong> {new Date(volo.dataOraArrivo).toLocaleString()}
      </p>
      <p>
        <strong>Costo:</strong> €{volo.costoVolo?.toFixed(2)}
      </p>
    </Container>
  );
};

export default VoloDetailPage;
