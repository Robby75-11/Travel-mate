import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const CardVolo = ({ volo }) => {
  if (!volo) return null;

  const {
    id,
    compagniaAerea = "Compagnia sconosciuta",
    aeroportoPartenza = "N/A",
    aeroportoArrivo = "N/A",
    dataOraPartenza,
    dataOraArrivo,
    costoVolo,
    immaginePrincipale,
  } = volo;

  const immagine = immaginePrincipale?.trim()
    ? immaginePrincipale
    : "https://placehold.co/600x400/e0e0e0/000000?text=Nessuna+Immagine";
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePrenotaClick = () => {
    if (!isAuthenticated) {
      navigate("/login"); // Reindirizza al login
    } else {
      navigate(`/flights/${id}/prenota`); // Vai alla pagina di prenotazione
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return isNaN(date.getTime())
      ? "Data non disponibile"
      : date.toLocaleString("it-IT");
  };

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "16px" }}>
      <Link to={`/flights/${id}`}>
        <Card.Img
          variant="top"
          src={immagine}
          alt={`Immagine volo ${compagniaAerea}`}
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-semibold fs-5">
          <i className="bi bi-airplane-engines me-2"></i>
          {compagniaAerea}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {aeroportoPartenza} → {aeroportoArrivo}
        </Card.Subtitle>

        <Card.Text className="flex-grow-1">
          <i className="bi bi-clock me-1"></i>
          <strong>Partenza:</strong> {formatDateTime(dataOraPartenza)}
          <br />
          <i className="bi bi-clock-history me-1"></i>
          <strong>Arrivo:</strong> {formatDateTime(dataOraArrivo)}
        </Card.Text>

        <div className="mt-3">
          <Badge bg="info" className="mb-2 fs-6 px-3 py-2">
            Costo volo: €{costoVolo?.toFixed(2) ?? "N.D."}
          </Badge>
          <Button
            as={Link}
            to={`/flights/${id}`}
            variant="outline-info"
            size="sm"
            className="flex-fill"
          >
            Vedi Dettagli
          </Button>
          <Button
            onClick={handlePrenotaClick}
            variant="primary"
            size="sm"
            className="w-100 mt-2"
          >
            <i className="bi bi-bookmark-check me-1"></i>
            Prenota ora
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardVolo;
