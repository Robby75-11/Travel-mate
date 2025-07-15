import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LastMinute from "../Components/LastMinute";
import { getAllHotels, getAllVoli, getAllViaggi } from "../api";

const LastMinutePage = () => {
  const [hotels, setHotels] = useState([]);
  const [voli, setVoli] = useState([]);
  const [viaggi, setViaggi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, voloData, viaggioData] = await Promise.all([
          getAllHotels(),
          getAllVoli(),
          getAllViaggi(),
        ]);
        setHotels(hotelData);
        setVoli(voloData);
        setViaggi(viaggioData);
      } catch (error) {
        console.error("Errore nel caricamento dati:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🎯 Offerte Last Minute</h2>
      <LastMinute hotels={hotels} voli={voli} viaggi={viaggi} />
    </Container>
  );
};

export default LastMinutePage;
