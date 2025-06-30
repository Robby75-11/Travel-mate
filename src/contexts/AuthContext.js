// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Assicurati di aver installato: npm install jwt-decode
import { loginUser, logout } from "../api"; // I tuoi metodi API definiti in src/api.js

// Crea il contesto di autenticazione
const AuthContext = createContext(null);

// Componente Provider che fornirà lo stato di autenticazione a tutta l'app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'UTENTE', 'AMMINISTRATORE', ecc.
  const [userId, setUserId] = useState(null); // ID dell'utente loggato

  // Effetto che si esegue una volta al caricamento del componente
  // per verificare se c'è un token JWT già salvato e valido
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Controlla se il token è scaduto
        // decodedToken.exp è in secondi, Date.now() è in millisecondi
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          // Il payload del tuo token JWT dovrebbe includere il ruolo (es. "roles") e l'ID utente (es. "id")
          // Adatta questi nomi di campo se sono diversi nel tuo backend
          const roles = decodedToken.roles || []; // Assumi il campo sia 'roles'
          setUserRole(roles.length > 0 ? roles[0].replace("ROLE_", "") : null); // Rimuovi il prefisso 'ROLE_'
          setUserId(decodedToken.id || null); // Assumi il campo sia 'id'
        } else {
          handleLogout(); // Se il token è scaduto, esegui il logout
        }
      } catch (error) {
        console.error("Errore nel decodificare il token:", error);
        handleLogout(); // Se c'è un errore nella decodifica, esegui il logout
      }
    }
  }, []); // L'array vuoto assicura che l'effetto si esegua solo una volta al mount

  // Funzione per gestire il login
  const handleLogin = async (credentials) => {
    try {
      const data = await loginUser(credentials); // Chiama l'API di login
      const decodedToken = jwtDecode(data.token); // Decodifica il token ricevuto
      setIsAuthenticated(true); // Imposta lo stato di autenticazione a true
      const roles = decodedToken.roles || [];
      setUserRole(roles.length > 0 ? roles[0].replace("ROLE_", "") : null);
      setUserId(decodedToken.id || null);
      return data; // Restituisce i dati della risposta (es. il token)
    } catch (error) {
      // Rilancia l'errore per essere gestito dal componente che chiama il login
      throw error;
    }
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    logout(); // Chiama la funzione di logout che rimuove il token da localStorage
    setIsAuthenticated(false); // Resetta lo stato di autenticazione
    setUserRole(null); // Resetta il ruolo
    setUserId(null); // Resetta l'ID utente
  };

  // Il valore fornito dal contesto a tutti i componenti figli
  const contextValue = {
    isAuthenticated,
    userRole,
    userId,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}{" "}
      {/* Renderizza i componenti figli che possono accedere al contesto */}
    </AuthContext.Provider>
  );
};

// Hook usato per contesto di autenticazione

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Questo errore si verifica se useAuth viene chiamato fuori dal AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
