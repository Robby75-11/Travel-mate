// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode"; // Assicurati di aver installato: npm install jwt-decode
import { loginUser, logout } from "../api.js"; // I tuoi metodi API definiti in src/api.js

// Crea il contesto di autenticazione
const AuthContext = createContext(null);

// Hook personalizzato per usare il contesto di autenticazione
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider del contesto di autenticazione
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Stato di caricamento iniziale

  // Funzione per decodificare il token e impostare lo stato
  const decodeTokenAndSetState = useCallback((token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tempo attuale in secondi

        if (decoded.exp > currentTime) {
          // Token valido
          setIsAuthenticated(true);
          // Assumi che il ruolo sia nel claim 'role' o 'roles'
          // E che il backend invii "ROLE_UTENTE" o "ROLE_AMMINISTRATORE"
          const roles = decoded.roles || decoded.role;
          if (Array.isArray(roles) && roles.length > 0) {
            setUserRole(roles[0].replace("ROLE_", "")); // Rimuovi il prefisso 'ROLE_'
          } else if (typeof roles === "string") {
            setUserRole(roles.replace("ROLE_", ""));
          } else {
            setUserRole(null); // Nessun ruolo trovato
          }
        } else {
          // Token scaduto
          console.log("Token JWT scaduto.");
          handleLogout(); // Effettua il logout se il token è scaduto
        }
      } catch (error) {
        console.error("Errore durante la decodifica del token JWT:", error);
        handleLogout(); // Effettua il logout in caso di errore di decodifica
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []); // Nessuna dipendenza, la funzione è statica

  // Effetto per il caricamento iniziale: controlla il token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    decodeTokenAndSetState(token);
    setLoading(false); // Imposta loading a false una volta controllato il token
  }, [decodeTokenAndSetState]); // Dipende da decodeTokenAndSetState

  // Funzione per gestire il login
  const handleLogin = async (credentials) => {
    try {
      // CORREZIONE: loginUser ora restituisce direttamente la stringa del token
      const token = await loginUser(credentials);
      // localStorage.setItem("jwtToken", token); // Questa riga è ora gestita all'interno di loginUser
      decodeTokenAndSetState(token); // Decodifica e imposta lo stato
      // Non è necessario restituire 'response' qui, dato che il token è già gestito
      // e non c'è altro da passare al componente chiamante (LoginPage)
    } catch (error) {
      console.error("Errore nel login:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem("jwtToken");
      throw error; // Rilancia l'errore per gestirlo nel componente di login
    }
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    logout(); // Rimuove il token da localStorage
    setIsAuthenticated(false);
    setUserRole(null);
    console.log("Logout effettuato con successo.");
  };

  // Il valore che verrà fornito a tutti i componenti che usano useAuth
  const authContextValue = {
    isAuthenticated,
    userRole,
    loading,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}{" "}
      {/* Renderizza i children solo dopo il caricamento iniziale */}
    </AuthContext.Provider>
  );
};
