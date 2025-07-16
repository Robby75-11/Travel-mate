import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavBar from "./Components/NavBar.jsx";
import Footer from "./Components/Footer.jsx";
// Importa il contesto di autenticazione che avvolge tutta l'app
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
// Pagine del Backoffice (per l'Admin)
import AdminViaggioManagementPage from "./Pages/admin/AdminViaggioManagementPage.jsx";
import AdminHotelManagementPage from "./Pages/admin/AdminHotelManagementPage.jsx";
import AdminUserManagementPage from "./Pages/admin/AdminUserManagementPage.jsx";
import AdminVoloManagementPage from "./Pages/admin/AdminVoloManagementPage.jsx"; // Pagina per la gestione dei voli
import AdminGestionePrenotazionePage from "./Pages/admin/AdminGestionePrenotazionePage.jsx"; // Pagina per la gestione prenotazioni
// Nuove pagine da aggiungere per i dettagli/List/prenotazione di hotel/Viaggio/volo
import HotelDetailPage from "./Pages/HotelDetailPage.jsx"; // Pagina per i dettagli di un singolo hotel
import HotelBookingPage from "./Pages/HotelBookingPage.jsx"; // Pagina per la prenotazione di un hotel
import HotelListPage from "./Pages/HotelListPage.jsx";
import ViaggioListPage from "./Pages/ViaggioListPage.jsx";
import ViaggioDetailPage from "./Pages/ViaggioDetailPage.jsx"; // Pagina per i dettagli di un singolo viaggio
import MyBookingsPage from "./Pages/MyBookingsPage.jsx";
import ViaggioBookingPage from "./Pages/ViaggioBookingPage.jsx"; // Importa ViaggioBookingPage
import VoloDetailPage from "./Pages/VoloDetailPage.jsx"; // Pagina per i dettagli di un singolo volo
import VoloListPage from "./Pages/VoloListPage.jsx"; // la pagina dei voli
import VoloBookingPage from "./Pages/VoloBookingPage.jsx"; // Pagina per la prenotazione di un volo
import RecensionePage from "./Pages/RecensionePage.jsx"; // Pagina per le recensioni dei viaggi
import LastMinutePage from "./Pages/LastMinutePage.jsx"; // Pagina per le offerte last minute

function App() {
  return (
    // <AuthProvider> deve avvolgere l'intera applicazione per rendere il contesto disponibile
    <AuthProvider>
      {/* Questo div `min-vh-100` e `d-flex flex-column` è per spingere il footer in fondo */}
      <div className="d-flex flex-column min-vh-100">
        <NavBar />

        {/* La sezione <main> conterrà il contenuto specifico di ogni pagina */}
        <main className="flex-grow-1">
          <Routes>
            {/* Rotta della Home Page: mostrata quando l'URL è "/" */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotte per le liste pubbliche di Hotel, Viaggi, ecc. */}
            <Route path="/hotels" element={<HotelListPage />} />
            <Route path="/trips" element={<ViaggioListPage />} />
            <Route path="/flights" element={<VoloListPage />} />
            {/* Rotta per i dettagli di un singolo Hotel (usato da CardHotel) */}
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/trips/:id" element={<ViaggioDetailPage />} />
            <Route path="/flights/:id" element={<VoloDetailPage />} />
            {/* Rotta per la prenotazione di un Hotel (usato da CardHotel) */}
            <Route path="/book-hotel/:id" element={<HotelBookingPage />} />
            {/* Rotta per la prenotazione di un Viaggio (usato da CardViaggio) */}
            <Route path="/book-trip/:id" element={<ViaggioBookingPage />} />
            {/* Rotta per la prenotazione di un Volo */}
            <Route path="/flights/:id/prenota" element={<VoloBookingPage />} />
            {/* Rotta per le prenotazioni dell'utente loggato */}
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            {/* Rotta per le recensioni */}
            <Route path="/recensioni/:tipo/:id" element={<RecensionePage />} />
            <Route path="/last-minute" element={<LastMinutePage />} />
            {/* Rotte del Backoffice (Accesso solitamente riservato agli Amministratori) */}
            <Route
              path="/admin/hotels"
              element={<AdminHotelManagementPage />}
            />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            <Route
              path="/admin/trips"
              element={<AdminViaggioManagementPage />}
            />
            <Route
              path="/admin/flights"
              element={<AdminVoloManagementPage />}
            />
            <Route
              path="/admin/bookings"
              element={<AdminGestionePrenotazionePage />}
            />
          </Routes>
        </main>
        {/* Il Footer è un componente globale, appare su tutte le pagine */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
