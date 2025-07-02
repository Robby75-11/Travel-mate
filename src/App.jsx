import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar.jsx";
import Footer from "./Components/Footer.jsx";
// Importa il contesto di autenticazione che avvolge tutta l'app
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";
// Importa le tue "Pagine" (assicurati delle estensioni .jsx per tutti i componenti React)
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import HotelListPage from "./Pages/HotelListPage.jsx";
import ViaggioListPage from "./Pages/ViaggioListPage.jsx";
import MyBookingsPage from "./Pages/MyBookingsPage.jsx";
// Pagine del Backoffice (per l'Admin)
import AdminHotelManagementPage from "./Pages/admin/AdminHotelManagementPage.jsx";
import AdminUserManagementPage from "./Pages/admin/AdminUserManagementPage.jsx";

// Nuove pagine da aggiungere per i dettagli/prenotazione di hotel (e ViaggioBookingPage)
import HotelDetailPage from "./Pages/HotelDetailPage.jsx"; // Pagina per i dettagli di un singolo hotel
import HotelBookingPage from "./Pages/HotelBookingPage.jsx"; // Pagina per la prenotazione di un hotel
import ViaggioBookingPage from "./Pages/ViaggioBookingPage.jsx"; // Importa ViaggioBookingPage

function App() {
  return (
    // <AuthProvider> deve avvolgere l'intera applicazione per rendere il contesto disponibile
    <AuthProvider>
      {/* Questo div `min-vh-100` e `d-flex flex-column` è per spingere il footer in fondo */}
      <div className="d-flex flex-column min-vh-100">
        {/* La NavBar è un componente globale, appare su tutte le pagine */}
        <NavBar />

        {/* La sezione <main> conterrà il contenuto specifico di ogni pagina */}
        <main className="flex-grow-1">
          {/* flex-grow-1 fa sì che il main occupi tutto lo spazio rimanente */}
          <Routes>
            {/* <Routes> è il contenitore principale per tutte le tue rotte */}

            {/* Rotta della Home Page: mostrata quando l'URL è "/" */}
            <Route path="/" element={<HomePage />} />

            {/* Rotte di Autenticazione */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotte per le liste pubbliche di Hotel, Viaggi, ecc. */}
            <Route path="/hotels" element={<HotelListPage />} />
            <Route path="/trips" element={<ViaggioListPage />} />

            {/* Rotta per i dettagli di un singolo Hotel (usato da CardHotel) */}
            <Route path="/hotels/:id" element={<HotelDetailPage />} />

            {/* Rotta per la prenotazione di un Hotel (usato da CardHotel) */}
            <Route path="/book-hotel/:id" element={<HotelBookingPage />} />

            {/* Rotta per la prenotazione di un Viaggio (usato da CardViaggio) */}
            <Route path="/book-trip/:id" element={<ViaggioBookingPage />} />

            {/* Rotta per le prenotazioni dell'utente loggato */}
            <Route path="/my-bookings" element={<MyBookingsPage />} />

            {/* Rotte del Backoffice (Accesso solitamente riservato agli Amministratori) */}
            <Route
              path="/admin/hotels"
              element={<AdminHotelManagementPage />}
            />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            {/* Aggiungi qui altre rotte per il backoffice */}
          </Routes>
        </main>

        {/* Il Footer è un componente globale, appare su tutte le pagine */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
