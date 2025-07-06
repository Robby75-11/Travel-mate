import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css"; // Assicurati che sia incluso

const CardVolo = ({ volo }) => {
  return (
    <Card className="h-100 shadow-sm">
      <div
        className="d-flex justify-content-center align-item-center bg-light"
        style={{ height: "200px", fontSize: "4rem" }}
      >
        <i className="bi bi-airplane-engines text-primary"></i>
      </div>
      <Card.Body>
        <Card.Title>
          <i className="bi bi-airplane-engines me-2"></i>
          {volo.compagnia}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {volo.partenza} → {volo.arrivo}
        </Card.Subtitle>
        <Card.Text>
          <i className="bi bi-clock me-1"></i>
          <strong>Partenza:</strong>{" "}
          {new Date(volo.dataPartenza).toLocaleString()}
          <br />
          <i className="bi bi-clock-history me-1"></i>
          <strong>Arrivo:</strong> {new Date(volo.dataArrivo).toLocaleString()}
          <br />
          <i className="bi bi-cash-coin me-1"></i>
          <strong>Costo:</strong> €{volo.costoVolo?.toFixed(2) ?? "N.D."}
        </Card.Text>
        <Button as={Link} to={`/flights/${volo.id}/prenota`} variant="primary">
          <i className="bi bi-bookmark-check me-1"></i>
          Prenota ora
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardVolo;
