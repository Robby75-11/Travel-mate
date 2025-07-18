import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import "./App.css"; // Importa il file CSS per gli stili globali

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Avvolgi l'App con BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
