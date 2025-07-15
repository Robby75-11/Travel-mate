import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"; // Importa useAuth per controllare lo stato di autenticazione
import { getAllHotels, getAllViaggi, getAllVoli } from "../api";
import CardHotel from "../Components/CardHotel";
import CardViaggio from "../Components/CardViaggio";
import CardVolo from "../Components/CardVolo";
import SearchBar from "../Components/SearchBar";
import { useState, useEffect } from "react";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [viaggi, setViaggi] = useState([]);
  const [voli, setVoli] = useState([]);
  const [filters, setFilters] = useState({
    partenza: "",
    destinazione: "",
    data: "",
    passeggeri: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, viaggioData, voloData] = await Promise.all([
          getAllHotels(),
          getAllViaggi(),
          getAllVoli(),
        ]);
        setHotels(hotelData);
        setViaggi(viaggioData);
        setVoli(voloData);
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      }
    };
    fetchData();
  }, []);

  // Filtri dinamici per hotel
  const filteredHotels = hotels.filter((h) => {
    const matchCity = h.citta
      ?.toLowerCase()
      .includes(filters.destinazione.toLowerCase());

    return matchCity;
  });

  // Filtri dinamici per viaggi
  const filteredViaggi = viaggi.filter((v) => {
    const matchDest = v.destinazione
      ?.toLowerCase()
      .includes(filters.destinazione.toLowerCase());
    const matchData = filters.data
      ? v.dataPartenza?.startsWith(filters.data)
      : true;
    return matchDest && matchData;
  });

  // Filtri dinamici per voli
  const filteredVoli = voli.filter((v) => {
    const matchPartenza = v.partenza
      ?.toLowerCase()
      .includes(filters.partenza.toLowerCase());
    const matchDest = v.destinazione
      ?.toLowerCase()
      .includes(filters.destinazione.toLowerCase());
    const matchData = filters.data
      ? v.dataPartenza?.startsWith(filters.data)
      : true;
    return matchPartenza && matchDest && matchData;
  });
  return (
    <Container className="mt-4">
      {/* Sezione Hero / Introduttiva */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={10} lg={8}>
          <h1 className="display-4 fw-bold mb-3">
            Trova la Tua Prossima Avventura con Travel Mate
          </h1>
          <p className="lead text-muted mb-4">
            Esplora destinazioni incredibili, prenota hotel, voli e viaggi
            organizzati. Il tuo viaggio inizia qui!
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button
              as={Link}
              to="/trips"
              variant="primary"
              size="lg"
              className="px-4 gap-3"
            >
              Esplora Viaggi
            </Button>
            <Button
              as={Link}
              to="/hotels"
              variant="outline-secondary"
              size="lg"
              className="px-4"
            >
              Cerca Hotel
            </Button>
            <Button
              as={Link}
              to="/flights"
              variant="outline-info"
              size="lg"
              className="px-4"
            >
              Prenota Voli
            </Button>
          </div>
        </Col>
      </Row>

      {/* Sezione Call to Action per Login/Registrazione (visibile solo se NON autenticato) */}
      {!isAuthenticated && ( // Mostra questa sezione solo se l'utente NON è autenticato
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <Card className="p-4 shadow-lg bg-light">
              <Card.Body>
                <h3 className="mb-3">Pronto a Partire?</h3>
                <p className="text-muted">
                  Accedi o registrati per gestire le tue prenotazioni e scoprire
                  offerte personalizzate.
                </p>
                <Button
                  as={Link}
                  to="/login"
                  variant="success"
                  size="lg"
                  className="me-2"
                >
                  Accedi
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-success"
                  size="lg"
                >
                  Registrati
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 🔎 Barra di ricerca */}
      <Row className="justify-content-center mb-3">
        <Col md={10}>
          <SearchBar onSearch={setFilters} />
        </Col>
      </Row>

      {/* 🏨 Lista Hotel */}
      <h3 className="mt-4 mb-3">Hotel Disponibili</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredHotels.map((hotel) => (
          <Col key={hotel.id}>
            <CardHotel hotel={hotel} />
          </Col>
        ))}
      </Row>

      {/* ✈️ Lista Voli */}
      <h3 className="mb-4"></h3>
      <Row className="mb-5">
        {filteredVoli.slice(0, 3).map((volo) => (
          <Col key={volo.id} md={4} className="mb-4">
            <CardVolo volo={volo} />
          </Col>
        ))}
      </Row>
      {/* ✈️ Lista Viaggi */}
      <h3 className="mt-5 mb-3">Viaggi Disponibili</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredViaggi.map((viaggio) => (
          <Col key={viaggio.id}>
            <CardViaggio viaggio={viaggio} />
          </Col>
        ))}
      </Row>
      {/* Sezione "Perché Sceglierci" */}
      <Row className="mb-5 text-center">
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-globe-americas fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Globe */}
              <Card.Title>Destinazioni Globali</Card.Title>
              <Card.Text>
                Un'ampia selezione di mete in tutto il mondo per ogni tipo di
                viaggiatore.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-wallet-fill fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Wallet */}
              <Card.Title>Prezzi Competitivi</Card.Title>
              <Card.Text>
                Offerte esclusive e tariffe vantaggiose per un viaggio senza
                pensieri.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 p-3 shadow-sm">
            <Card.Body>
              <i className="bi bi-headset fs-1 text-primary mb-3"></i>{" "}
              {/* Icona Headset */}
              <Card.Title>Supporto 24/7</Card.Title>
              <Card.Text>
                Assistenza clienti dedicata disponibile in ogni momento del tuo
                viaggio.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
