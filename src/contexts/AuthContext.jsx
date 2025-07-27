import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, logout } from "../api.js"; // Metodi API definiti in src/api.js

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
  const [currentUser, setCurrentUser] = useState(null); // Stato per l'utente corrente

  // Funzione per gestire il logout (definita qui per essere usata in decodeTokenAndSetState)
  const handleLogout = useCallback(() => {
    logout(); // Rimuove il token da localStorage
    setIsAuthenticated(false);
    setUserRole(null);
    console.log("Logout effettuato con successo.");
  }, []); // handleLogout non ha dipendenze che cambiano, quindi è stabile

  // Funzione per decodificare il token e impostare lo stato
  const decodeTokenAndSetState = useCallback(
    (token) => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Tempo attuale in secondi

          if (decoded.exp > currentTime) {
            // Token valido
            setIsAuthenticated(true);
            // Assumi che il ruolo sia nel claim 'role' o 'roles'
            // E che il backend invii "ROLE_UTENTE" o "ROLE_AMMINISTRATORE"
            setCurrentUser({
              id: decoded.id,
              nome: decoded.nome,
              cognome: decoded.cognome,
              email: decoded.sub || decoded.email,
            });

            const roles = decoded.roles || decoded.role;
            if (Array.isArray(roles) && roles.length > 0) {
              setUserRole(roles[0].replace("ROLE_", ""));
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
    },
    [handleLogout]
  ); // CORREZIONE: Aggiunta handleLogout come dipendenza

  // Effetto per il caricamento iniziale: controlla il token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    decodeTokenAndSetState(token);
    setLoading(false); // Imposta loading a false una volta controllato il token
  }, [decodeTokenAndSetState]); // Dipende da decodeTokenAndSetState

  // Funzione per gestire il login
  const handleLogin = async (credentials) => {
    try {
      const token = await loginUser(credentials);
      // localStorage.setItem("jwtToken", token); // RIMOZIONE: Questa riga è gestita in api.js/loginUser
      decodeTokenAndSetState(token); // Decodifica e imposta lo stato
    } catch (error) {
      console.error("Errore nel login:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem("jwtToken"); // Assicura che il token sia rimosso in caso di errore di login
      throw error; // Rilancia l'errore per gestirlo nel componente di login
    }
  };

  // Il valore che verrà fornito a tutti i componenti che usano useAuth
  const authContextValue = {
    isAuthenticated,
    userRole,
    currentUser, // Aggiunto currentUser per accedere ai dettagli dell'utente
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
