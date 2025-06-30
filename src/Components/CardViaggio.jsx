// src/components/CardViaggio.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// La prop 'viaggio' conterrà tutti i dettagli del viaggio, inclusa immagineUrl
// La prop 'isBooked' (opzionale) servirà per mostrare lo stato in contesti come MyBookingsPage
function CardViaggio({ viaggio, isBooked = false, onCancelBooking = null }) {
  const {
    id,
    destinazione,
    dataPartenza,
    dataRitorno,
    descrizione,
    immagineUrl,
    prezzo,
  } = viaggio;

  const formattedDataPartenza = new Date(dataPartenza).toLocaleDateString(
    "it-IT"
  );
  const formattedDataRitorno = new Date(dataRitorno).toLocaleDateString(
    "it-IT"
  );

  return (
    <Card className="h-100 shadow-sm">
      {/* Immagine del Viaggio (dall'URL di Cloudinary) */}
      {immagineUrl && (
        <Card.Img
          variant="top"
          src={immagineUrl} // L'URL caricato su Cloudinary
          alt={`Immagine di ${destinazione}`}
          style={{ height: "200px", objectFit: "cover" }} // Stile per l'immagine
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{destinazione}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Dal {formattedDataPartenza} al {formattedDataRitorno}
        </Card.Subtitle>
        <Card.Text className="flex-grow-1">
          {descrizione.substring(0, 150)}... {/* Tronca la descrizione */}
        </Card.Text>

        <div className="mt-auto">
          {" "}
          {/* Spinge gli elementi sottostanti verso il fondo della card */}
          {/* Prezzo */}
          <h5 className="text-primary mb-3">
            € {prezzo ? prezzo.toFixed(2) : "N/A"}
          </h5>
          {/* Sezione Bottoni e Stato */}
          <div className="d-flex justify-content-between align-items-center">
            {isBooked ? (
              // Mostra se il viaggio è già stato prenotato (es. in MyBookingsPage)
              <>
                <span className="badge bg-success">Prenotato</span>
                {/* Bottone Annulla, visibile solo se è prenotato e viene fornita la funzione onCancelBooking */}
                {onCancelBooking && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onCancelBooking(id)}
                  >
                    Annulla Prenotazione
                  </Button>
                )}
                {/* Qui potresti aggiungere un bottone "Vedi Dettagli Prenotazione" */}
              </>
            ) : (
              // Mostra se il viaggio è disponibile per la prenotazione (es. in ViaggioListPage)
              <>
                {/* Bottone "Prenota Ora" che porta alla pagina di prenotazione specifica */}
                <Button as={Link} to={`/book-trip/${id}`} variant="primary">
                  Prenota Ora
                </Button>
                {/* Qui potresti aggiungere un bottone "Vedi Descrizione" per un modale o una pagina dettagli */}
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardViaggio;
