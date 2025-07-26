import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // Importa i componenti Bootstrap
import { useNavigate } from "react-router-dom"; // Per reindirizzare l'utente dopo il login
import { useAuth } from "../contexts/AuthContext.jsx"; // Importa il tuo contesto di autenticazione

function LoginPage() {
  // Stato per gestire i dati del form (email e password)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  // Stato per gestire eventuali messaggi di errore o successo
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate(); // Hook per la navigazione programmatica
  const { handleLogin } = useAuth(); // Ottieni la funzione handleLogin dal contesto di autenticazione

  // Funzione per aggiornare lo stato del form al cambiamento degli input
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    setMessage(""); // Resetta i messaggi precedenti
    setIsError(false);

    try {
      // Chiama la funzione di login dal contesto di autenticazione
      await handleLogin(credentials);

      setMessage(
        "Accesso effettuato con successo! Reindirizzamento alla Home..."
      );
      setIsError(false);
      // Reindirizza l'utente alla Home Page dopo un breve ritardo
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5 secondi di attesa
    } catch (error) {
      console.error("Errore durante il login:", error);
      // Gestisci l'errore dalla risposta del backend
      // Cerca un messaggio specifico nell'errore della risposta (es. error.response.data.message)
      const errorMessage =
        error.response?.data?.message || "Credenziali non valide. Riprova.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-lg"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4">Accedi</h2>
          {/* Mostra messaggi di errore o successo */}
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Indirizzo Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci email"
                name="email" // Il nome deve corrispondere alla chiave in credentials
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password" // Il nome deve corrispondere alla chiave in credentials
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Accedi
            </Button>
          </Form>

          {/* Link a "password dimenticata" */}
          <p className="text-center mt-2">
            <Button variant="link" onClick={() => navigate("/forgot-password")}>
              Password dimenticata?
            </Button>
          </p>

          <p className="text-center mt-3">
            Non hai un account?{" "}
            <Button variant="link" onClick={() => navigate("/register")}>
              Registrati qui
            </Button>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
