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
      <p key="hotel-indirizzo">Indirizzo: {hotelIndirizzo || "N/A"}</p>
    );
    details.push(<p key="hotel-citta">Città: {hotelCitta || "N/A"}</p>);
    details.push(
      <p key="hotel-descrizione">
        {hotelDescrizione ? hotelDescrizione.substring(0, 100) + "..." : "N/A"}
      </p>
    );
    details.push(
      <p key="hotel-prezzo">
        Prezzo per notte: € {hotelPrezzoNotte?.toFixed(2) || "N/A"}
      </p>
    );
    linkToDetails = hotelId ? `/hotels/${hotelId}` : null;
  } else if (bookingType === "Viaggio") {
    title = viaggioDestinazione || destinazione;
    imageUrl = prenotazione.viaggio?.immagineUrl; // Se l'immagine non è appiattita
    details.push(
      <p key="viaggio-partenza">
        Partenza:{" "}
        {viaggioDataPartenza
          ? new Date(viaggioDataPartenza).toLocaleDateString("it-IT")
          : "N/A"}
      </p>
    );
    details.push(
      <p key="viaggio-ritorno">
        Ritorno:{" "}
        {viaggioDataRitorno
          ? new Date(viaggioDataRitorno).toLocaleDateString("it-IT")
          : "N/A"}
      </p>
    );
    details.push(
      <p key="viaggio-descrizione">
        {viaggioDescrizione
          ? viaggioDescrizione.substring(0, 100) + "..."
          : "N/A"}
      </p>
    );
    linkToDetails = viaggioId ? `/trips/${viaggioId}` : null; // Assumendo un endpoint /trips/:id
  } else if (bookingType === "Volo") {
    title = `Volo ${voloCompagniaAerea || ""} per ${
      voloAeroportoArrivo || destinazione
    }`;
    details.push(
      <p key="volo-partenza">Da: {voloAeroportoPartenza || "N/A"}</p>
    );
    details.push(<p key="volo-arrivo">A: {voloAeroportoArrivo || "N/A"}</p>);
    details.push(
      <p key="volo-data-partenza">
        Partenza:{" "}
        {voloDataOraPartenza
          ? new Date(voloDataOraPartenza).toLocaleString("it-IT")
          : "N/A"}
      </p>
    );
    details.push(
      <p key="volo-data-arrivo">
        Arrivo:{" "}
        {voloDataOraArrivo
          ? new Date(voloDataOraArrivo).toLocaleString("it-IT")
          : "N/A"}
      </p>
    );
    details.push(
      <p key="volo-prezzo">Prezzo: € {voloPrezzo?.toFixed(2) || "N/A"}</p>
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
        <Card.Text className="flex-grow-1">
          <p>Prenotato il: {displayDataPrenotazione}</p>
          <p>
            Periodo: dal {displayDateInizio} al {displayDateFine}
          </p>
          {details}
        </Card.Text>

        <div className="mt-auto">
          <h5 className="text-primary mb-3">
            Prezzo Totale: € {prezzo?.toFixed(2) || "N/A"}
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
