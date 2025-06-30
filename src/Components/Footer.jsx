import React from "react";
import { Container } from "react-bootstrap"; // Importa Container da React-Bootstrap

function Footer() {
  return (
    // Il tag <footer> racchiude il contenuto del footer.
    // Le classi Bootstrap 'bg-body-tertiary', 'mt-auto' e 'py-3'
    // servono a dargli un colore di sfondo, a spingerlo in fondo alla pagina
    // e a dare un po' di padding verticale.
    <footer className="bg-body-tertiary mt-auto py-3">
      <Container className="text-center">
        {" "}
        {/* Centra il testo all'interno del footer */}
        <p className="mb-0">
          {" "}
          {/* mb-0 rimuove il margine inferiore predefinito del paragrafo */}
          &copy; {new Date().getFullYear()} Travel Mate. Tutti i diritti
          riservati.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
