import React from "react";
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
  } = volo;

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return isNaN(date.getTime())
      ? "Data non disponibile"
      : date.toLocaleString("it-IT");
  };

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "16px" }}>
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{
          height: "200px",
          fontSize: "4rem",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <i className="bi bi-airplane-engines text-primary"></i>
      </div>

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
            to={`/flights/${id}/prenota`}
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
