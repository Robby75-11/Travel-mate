import axios from "axios";
// verranno automaticamente reindirizzate a http://localhost:8080.
const api = axios.create({
  baseURL: "http://localhost:8080",
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
export const uploadHotelImage = async (id, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // 'files' deve combaciare con @RequestParam("files") nel backend
  });

  try {
    const response = await axios.patch(
      `http://localhost:8080/hotel/${id}/immagine`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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
    console.log("Risposta API /utenti:", response.data);
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

// Aggiorna il ruolo di un utente (es. da UTENTE a AMMINISTRATORE)
export const updateUserRole = async (id, ruolo) => {
  try {
    const response = await api.patch(`/utenti/${id}/ruolo`, null, {
      params: { ruolo }, // viene passato come query parameter ?ruolo=ROLE_AMMINISTRATORE
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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

// --- 4. Metodi per Viaggi (Endpoint: /viaggi) ---

// Carica l'immagine di un viaggio (richiede ruolo AMMINISTRATORE)
export const uploadMultipleViaggioImages = async (id, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // Deve combaciare con @RequestParam("files")
  });

  const response = await axios.patch(
    `http://localhost:8080/viaggi/${id}/immagini`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }
  );

  return response.data;
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
    const response = await api.post("/prenotazioni", bookingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore nella prenotazione del viaggio"
    );
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
    const response = await api.post("/prenotazioni", bookingData); // usa Axios con interceptor!
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Errore nella prenotazione dell'hotel"
    );
  }
};

// --- 6. Metodi per Voli (Endpoint: /voli) ---

export const createVolo = async (formData) => {
  try {
    const response = await api.post("/voli", formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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
export const prenotaVolo = async (bookingData) => {
  try {
    const response = await api.post("/prenotazioni", bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Errore nella prenotazione del volo";
  }
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
export const deleteVolo = async (voloId) => {
  try {
    const response = await api.delete(`/voli/${voloId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Carica l'immagine di un volo (es. aereo o tratta visiva)
export const uploadVoloImage = async (id, file) => {
  const formData = new FormData();
  formData.append("files", file);
  try {
    const response = await api.patch(`/voli/${id}/immagine`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// --- 7. Metodi per Prenotazioni (Endpoint: /prenotazioni) ---
export const getAllPrenotazioni = async () => {
  try {
    const response = await api.get("/prenotazioni");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePrenotazione = async (id, data) => {
  const response = await api.put(`/prenotazioni/${id}`, data);
  return response.data;
};

export const inviaEmailConferma = async (emailRequestDto) => {
  const response = await api.post("/email/invia", emailRequestDto);
  return response.data;
};

// Elimina una prenotazione tramite ID (richiede autenticazione)
export const deletePrenotazione = async (id) => {
  try {
    const response = await api.delete(`/prenotazioni/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- 8. Metodi per Recensioni (Endpoint: /recensioni) ---

// Recupera le recensioni per hotel o viaggio
export const getRecensioniByTipoAndId = async (tipo, id) => {
  try {
    const response = await api.get(`/recensioni/${tipo}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Invia una nuova recensione (hotel o viaggio)
export const createRecensione = async (tipo, recensioneData) => {
  try {
    const response = await api.post(`/recensioni/${tipo}`, recensioneData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export default api;
