import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function CardViaggio({ viaggio, isBooked = false, onCancelBooking = null }) {
  if (!viaggio || typeof viaggio !== "object") return null;

  const {
    id,
    destinazione = "Destinazione non disponibile",
    dataPartenza,
    dataRitorno,
    descrizione = "Nessuna descrizione disponibile",
    costoViaggio,
    immaginePrincipale,
  } = viaggio;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Data non disponibile"
      : date.toLocaleDateString("it-IT");
  };

  const immagine = immaginePrincipale
    ? immaginePrincipale.startsWith("http")
      ? immaginePrincipale.replace("http://", "https://")
      : `${import.meta.env.VITE_API_URL}/${immaginePrincipale}`
    : "https://placehold.co/600x400/e0e0e0/000000?text=Nessuna+Immagine";
  const prezzo = !isNaN(parseFloat(costoViaggio))
    ? parseFloat(costoViaggio).toFixed(2)
    : "N.D.";

  return (
    <Card
      className="h-100 shadow-sm border-0"
      style={{
        borderRadius: "16px",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <Link to={`/trips/${id}`}>
        <Card.Img
          variant="top"
          src={immagine}
          alt={`Immagine di ${destinazione}`}
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-semibold fs-5 text-capitalize">
          {destinazione}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          Dal {formatDate(dataPartenza)} al {formatDate(dataRitorno)}
        </Card.Subtitle>

        <Card.Text
          className="flex-grow-1"
          style={{
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
            overflow: "hidden",
          }}
        >
          {descrizione}
        </Card.Text>

        <div className="mt-3">
          <Badge bg="info" className="mb-2 fs-6 px-3 py-2">
            Costo Viaggio: € {prezzo}
          </Badge>

          <div className="d-flex justify-content-between flex-wrap mt-2 gap-2">
            {isBooked ? (
              <>
                <Badge bg="success" className="align-self-center">
                  Prenotato
                </Badge>
                {onCancelBooking && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onCancelBooking(id)}
                  >
                    Annulla Prenotazione
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to={`/trips/${id}`}
                  variant="outline-warning"
                  size="sm"
                  className="flex-fill"
                >
                  Vedi Dettagli
                </Button>
                <Button
                  as={Link}
                  to={`/book-trip/${id}`}
                  variant="primary"
                  size="sm"
                  className="flex-fill"
                >
                  Prenota Ora
                </Button>
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardViaggio;
