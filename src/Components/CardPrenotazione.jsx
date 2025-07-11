import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function CardPrenotazione({ prenotazione, onCancelBooking }) {
  // Estrai i campi appiattiti dal PrenotazioneResponseDto
  const {
    id,
    dataPrenotazione,
    statoPrenotazione,
    destinazione, // Questo campo è già popolato nel backend
    dataInizio,
    dataFine,
    prezzo,
    // Dettagli Hotel
    hotelId,
    hotelNome,
    hotelIndirizzo,
    hotelCitta,
    hotelDescrizione,
    hotelPrezzoNotte,
    hotelImmagineUrl,
    // Dettagli Viaggio
    viaggioId,
    viaggioDestinazione,
    viaggioDataPartenza,
    viaggioDataRitorno,
    viaggioDescrizione,
    viaggioImmagineUrl,
    // Dettagli Volo
    voloId,
    voloCompagniaAerea,
    voloAeroportoPartenza,
    voloAeroportoArrivo,
    voloDataOraPartenza,
    voloDataOraArrivo,
    voloPrezzo,
  } = prenotazione;

  // Determina il tipo di prenotazione
  const bookingType = hotelId
    ? "Hotel"
    : viaggioId
    ? "Viaggio"
    : voloId
    ? "Volo"
    : "Sconosciuto";

  const displayDateInizio = dataInizio
    ? new Date(dataInizio).toLocaleDateString("it-IT")
    : "N/A";
  const displayDateFine = dataFine
    ? new Date(dataFine).toLocaleDateString("it-IT")
    : "N/A";
  const displayDataPrenotazione = dataPrenotazione
    ? new Date(dataPrenotazione).toLocaleDateString("it-IT")
    : "N/A";

  let title = destinazione;
  let imageUrl = null;
  let details = [];
  let linkToDetails = null;

  if (bookingType === "Hotel") {
    title = hotelNome || destinazione;
    imageUrl = hotelImmagineUrl;
    details.push(
      <div key="hotel-indirizzo">Indirizzo: {hotelIndirizzo || "N/A"}</div>
    );
    details.push(<p key="hotel-citta">Città: {hotelCitta || "N/A"}</p>);
    details.push(
      <div key="hotel-descrizione">
        {hotelDescrizione ? hotelDescrizione.substring(0, 100) + "..." : "N/A"}
      </div>
    );
    details.push(
      <div key="hotel-prezzo">
        Prezzonotte: € {hotelPrezzoNotte?.toFixed(2)}
      </div>
    );
    linkToDetails = hotelId ? `/hotels/${hotelId}` : null;
  } else if (bookingType === "Viaggio") {
    title = viaggioDestinazione || destinazione;
    imageUrl = imageUrl = viaggioImmagineUrl; // Se l'immagine non è appiattita
    details.push(
      <div key="viaggio-partenza">
        Partenza:{" "}
        {viaggioDataPartenza
          ? new Date(viaggioDataPartenza).toLocaleDateString("it-IT")
          : "N/A"}
      </div>
    );
    details.push(
      <div key="viaggio-ritorno">
        Ritorno:{" "}
        {viaggioDataRitorno
          ? new Date(viaggioDataRitorno).toLocaleDateString("it-IT")
          : "N/A"}
      </div>
    );
    details.push(
      <div key="viaggio-descrizione">
        {viaggioDescrizione
          ? viaggioDescrizione.substring(0, 100) + "..."
          : "N/A"}
      </div>
    );
    linkToDetails = viaggioId ? `/trips/${viaggioId}` : null; // Assumendo un endpoint /trips/:id
  } else if (bookingType === "Volo") {
    title = `Volo ${voloCompagniaAerea || ""} per ${
      voloAeroportoArrivo || destinazione
    }`;
    details.push(
      <div key="volo-partenza">Da: {voloAeroportoPartenza || "N/A"}</div>
    );
    details.push(<p key="volo-arrivo">A: {voloAeroportoArrivo || "N/A"}</p>);
    details.push(
      <div key="volo-data-partenza">
        Partenza:{" "}
        {voloDataOraPartenza
          ? new Date(voloDataOraPartenza).toLocaleString("it-IT")
          : "N/A"}
      </div>
    );
    details.push(
      <div key="volo-data-arrivo">
        Arrivo:{" "}
        {voloDataOraArrivo
          ? new Date(voloDataOraArrivo).toLocaleString("it-IT")
          : "N/A"}
      </div>
    );
    details.push(
      <div key="volo-prezzo">Prezzo: € {voloPrezzo?.toFixed(2) || "N/A"}</div>
    );
    linkToDetails = voloId ? `/flights/${voloId}` : null; // Assumendo un endpoint /flights/:id
  }

  return (
    <Card className="h-100 shadow-sm">
      {imageUrl && (
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={`Immagine di ${title}`}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Tipo: {bookingType} | Stato: {statoPrenotazione}
        </Card.Subtitle>
        <div className="flex-grow-1 card-text">
          <p>Prenotato il: {displayDataPrenotazione}</p>
          <p>
            Periodo: dal {displayDateInizio} al {displayDateFine}
          </p>
          {details}
        </div>

        <div className="mt-auto">
          <h5 className="text-primary mb-3">
            Prezzo Totale: € {prezzo?.toFixed(2)}
          </h5>

          <div className="d-flex justify-content-between">
            {linkToDetails && (
              <Button
                as={Link}
                to={linkToDetails}
                variant="primary"
                className="me-2"
              >
                Vedi Dettagli
              </Button>
            )}
            <Button variant="danger" onClick={() => onCancelBooking(id)}>
              Annulla Prenotazione
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardPrenotazione;
