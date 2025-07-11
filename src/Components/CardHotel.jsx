import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// La prop 'hotel' conterrà tutti i dettagli dell'hotel, inclusa immagineUrls (array)
function CardHotel({ hotel }) {
  const { id, nome, indirizzo, descrizione, immaginePrincipale, prezzoNotte } =
    hotel;

  // Determina le immagini da mostrare. Se immagineUrls non è un array o è vuoto, usa un placeholder.
  const imageToShow = immaginePrincipale?.trim()
    ? immaginePrincipale
    : "https://placehold.co/600x400/e0e0e0/000000?text=Nessuna+Immagine";

  return (
    <Card className="h-100 shadow-sm">
      {/* Altrimenti, mostra una singola immagine o il placeholder*/}
      <Card.Img
        variant="top"
        src={imageToShow} // Usa la prima immagine o il placeholder
        alt={`Immagine di ${nome}`}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        {/* flex-column per layout verticale, flex-grow-1 per espandersi */}
        <Card.Title>{nome}</Card.Title> {/* Nome dell'hotel */}
        <Card.Subtitle className="mb-2 text-muted">
          {indirizzo} {/* Indirizzo dell'hotel */}
        </Card.Subtitle>
        <Card.Text className="flex-grow-1">
          {/* Descrizione, limitata ai primi 150 caratteri */}
          {descrizione.substring(0, 150)}...
        </Card.Text>
        {/* Questo div 'mt-auto' spinge il contenuto sottostante (prezzo e bottoni)
            verso il fondo della card, mantenendo il layout pulito */}
        <div className="mt-auto">
          <h5 className="text-primary mb-3">
            Prezzo/notte: €{prezzoNotte.toFixed(2)}
          </h5>

          <div className="d-flex justify-content-between">
            {/* Contenitore per i bottoni */}
            {/* Bottone "Vedi Dettagli" */}
            <Button
              as={Link}
              to={`/hotels/${id}`}
              variant="primary"
              className="me-2"
            >
              {/* Aggiunto me-2 per margine destro */}
              Vedi Dettagli
            </Button>
            {/* Bottone "Prenota Ora" */}
            <Button
              as={Link}
              to={`/book-hotel/${id}`}
              variant="outline-primary"
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
