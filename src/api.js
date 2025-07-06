import axios from "axios";
// verranno automaticamente reindirizzate a http://localhost:8080.
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor per aggiungere il token JWT a ogni richiesta.
// Questo è cruciale per le API protette che richiedono autenticazione.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // Recupera il token da localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Aggiunge l'intestazione Authorization
    }
    return config; // Restituisce la configurazione della richiesta modificata
  },
  (error) => {
    return Promise.reject(error); // Gestisce eventuali errori prima dell'invio della richiesta
  }
);

// --- 1. Metodi di Autenticazione (Endpoint: /auth) ---

// Registra un nuovo utente
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data; // Restituisce i dati della risposta (es. messaggio di successo)
  } catch (error) {
    // Rilancia l'errore per gestirlo nel componente chiamante
    throw error.response ? error.response.data : error.message;
  }
};

// Effettua il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const token = response.data;
    localStorage.setItem("jwtToken", token); // Salva il token JWT in localStorage
    return token; // Restituisce i dati della risposta (es. il token)
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Effettua il logout (rimuove il token da localStorage)
export const logout = () => {
  localStorage.removeItem("jwtToken");
};

// --- 2. Metodi per Hotel (Endpoint: /hotel) ---

// Recupera tutti gli hotel
export const getAllHotels = async () => {
  try {
    const response = await api.get("/hotel");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera un hotel tramite ID
export const getHotelById = async (id) => {
  try {
    const response = await api.get(`/hotel/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Crea un nuovo hotel (richiede ruolo AMMINISTRATORE nel backend)
export const createHotel = async (hotelData) => {
  try {
    const response = await api.post("/hotel", hotelData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Aggiorna un hotel tramite ID (richiede ruolo AMMINISTRATORE)
export const updateHotel = async (id, hotelData) => {
  try {
    const response = await api.put(`/hotel/${id}`, hotelData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Elimina un hotel tramite ID (richiede ruolo AMMINISTRATORE)
export const deleteHotel = async (id) => {
  try {
    const response = await api.delete(`/hotel/${id}`);
    return response.data; // Spesso non c'è body per 204 No Content
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Carica l'immagine di un hotel (richiede ruolo AMMINISTRATORE)
export const uploadHotelImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file); // 'file' deve corrispondere al nome del parametro nel backend
  try {
    // Axios gestisce automaticamente il Content-Type 'multipart/form-data' per FormData
    const response = await api.patch(`/hotel/${id}/immagine`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- 3. Metodi per Utenti (Endpoint: /utenti - richiedono ruolo AMMINISTRATORE) ---

// Recupera tutti gli utenti
export const getAllUsers = async () => {
  try {
    const response = await api.get("/utenti");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera un utente tramite ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/utenti/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Aggiorna i dati di un utente (es. nome, email)
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/utenti/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Elimina un utente
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/utenti/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Aggiorna il ruolo di un utente (es. da UTENTE a AMMINISTRATORE)
export const updateUserRole = async (id, newRole) => {
  try {
    const response = await api.patch(`/utenti/${id}/role`, newRole, {
      headers: {
        "Content-Type": "text/plain", // Specifica il Content-Type se il backend si aspetta una stringa semplice
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- 4. Metodi per Viaggi (Endpoint: /viaggi) ---

// Carica l'immagine di un viaggio (richiede ruolo AMMINISTRATORE)
export const uploadViaggioImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file); // 'file' deve corrispondere al nome del parametro nel backend
  try {
    // Axios gestisce automaticamente il Content-Type 'multipart/form-data' per FormData
    const response = await api.patch(`/viaggi/${id}/immagine`, formData); // Endpoint per l'upload immagine viaggio
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera tutti i viaggi
export const getAllViaggi = async () => {
  try {
    const response = await api.get("/viaggi");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera un viaggio tramite ID
export const getViaggioById = async (id) => {
  try {
    const response = await api.get(`/viaggi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Crea un nuovo viaggio (richiede ruolo AMMINISTRATORE)
export const createViaggio = async (viaggioData) => {
  try {
    const response = await api.post("/viaggi", viaggioData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Aggiorna un viaggio tramite ID (richiede ruolo AMMINISTRATORE)
export const updateViaggio = async (id, viaggioData) => {
  try {
    const response = await api.put(`/viaggi/${id}`, viaggioData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Elimina un viaggio tramite ID (richiede ruolo AMMINISTRATORE)
export const deleteViaggio = async (id) => {
  try {
    const response = await api.delete(`/viaggi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- 5. Metodi per Prenotazioni (Endpoint: /prenotazioni) ---

// Crea una prenotazione per un viaggio (richiede utente loggato)
export const createViaggioBooking = async (bookingData) => {
  try {
    // bookingData dovrebbe contenere { viaggioId, dataInizio, dataFine, numPasseggeri }
    const response = await api.post("/prenotazioni/", bookingData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera le prenotazioni dell'utente loggato
export const getUserBookings = async () => {
  try {
    // L'endpoint dovrebbe recuperare le prenotazioni basate sull'utente loggato (dal JWT)
    const response = await api.get("/prenotazioni");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// (Opzionale) Annulla una prenotazione (richiede utente loggato o AMMINISTRATORE)
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/prenotazioni/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Crea una prenotazione per un hotel (richiede utente loggato)
export const createHotelBooking = async (bookingData) => {
  try {
    // bookingData dovrebbe contenere { hotelId, dataInizio, dataFine, numOspiti }
    const response = await api.post("/prenotazioni/", bookingData); // Assicurati che l'endpoint sia corretto nel tuo backend
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- 6. Metodi per Voli (Endpoint: /voli) ---

// Recupera tutti i voli
export const getAllVoli = async () => {
  try {
    const response = await api.get("/voli");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Recupera un volo tramite ID
export const getVoloById = async (id) => {
  try {
    const response = await api.get(`/voli/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Prenota un volo (richiede utente loggato)
export const prenotaVolo = async (prenotazione) => {
  const token = localStorage.getItem("token");

  // Se il token non è presente, blocca la richiesta
  if (!token) {
    throw new Error("Utente non autenticato. Effettua il login.");
  }

  const response = await fetch("/prenotazioni", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(prenotazione),
  });

  if (!response.ok) {
    throw new Error("Errore nella prenotazione del volo");
  }

  return await response.json();
};

// Crea un nuovo volo (richiede ruolo AMMINISTRATORE)
export const createVoloBooking = async (voloData) => {
  try {
    const response = await api.post("/voli", voloData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Aggiorna un volo tramite ID (richiede ruolo AMMINISTRATORE)
export const updateVolo = async (id, voloData) => {
  try {
    const response = await api.put(`/voli/${id}`, voloData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Elimina un volo tramite ID (richiede ruolo AMMINISTRATORE)
export const deleteVolo = async (id) => {
  try {
    const response = await api.delete(`/voli/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Carica l'immagine di un volo (es. aereo o tratta visiva)
export const uploadVoloImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.patch(`/voli/${id}/immagine`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
