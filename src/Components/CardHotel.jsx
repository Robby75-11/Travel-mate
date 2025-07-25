import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function CardHotel({ hotel }) {
  if (!hotel) return null;

  const {
    id,
    nome = "Hotel",
    indirizzo = "Indirizzo non disponibile",
    descrizione = "Nessuna descrizione disponibile",
    immaginePrincipale,
    prezzoNotte,
    stelle = 0,
  } = hotel;

  const immagine = immaginePrincipale
    ? immaginePrincipale.startsWith("https://")
      ? immaginePrincipale
      : immaginePrincipale.startsWith("http://")
      ? immaginePrincipale.replace("http://", "https://")
      : `${import.meta.env.VITE_API_URL}/${immaginePrincipale}`
    : "https://placehold.co/600x400/e0e0e0/000000?text=Nessuna+Immagine";

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "16px" }}>
      <Link to={`/hotels/${id}`}>
        <Card.Img
          variant="top"
          src={immagine}
          alt={`Immagine di ${nome}`}
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="fw-semibold fs-5 mb-0">{nome}</Card.Title>
          {stelle > 0 && (
            <div className="text-warning small">
              {Array(stelle).fill("⭐").join("")}
            </div>
          )}
        </div>

        <Card.Subtitle className="mb-1 text-muted">{indirizzo}</Card.Subtitle>

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
            Prezzo/notte: €{prezzoNotte?.toFixed(2) ?? "N.D."}
          </Badge>

          <div className="d-flex justify-content-between gap-2 mt-2">
            <Button
              as={Link}
              to={`/hotels/${id}`}
              variant="outline-warning"
              size="sm"
              className="flex-fill"
            >
              Vedi Dettagli
            </Button>
            <Button
              as={Link}
              to={`/book-hotel/${id}`}
              variant="primary"
              size="sm"
              className="flex-fill"
            >
              Prenota Ora
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardHotel;
