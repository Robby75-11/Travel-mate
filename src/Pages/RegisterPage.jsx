import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // Importa i componenti Bootstrap
import { registerUser } from "../api"; // Importa la funzione API per la registrazione
import { useNavigate } from "react-router-dom"; // Per reindirizzare l'utente dopo la registrazione

function RegisterPage() {
  // Stato per gestire i dati del form
  const [formData, setFormData] = useState({
    nome: "", // Modificato da 'username' a 'nome'
    cognome: "", // Aggiunto campo 'cognome'
    email: "",
    password: "",
    confirmPassword: "",
  });
  // Stato per gestire eventuali messaggi di errore o successo
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate(); // Hook per la navigazione programmatica

  // Funzione per aggiornare lo stato del form al cambiamento degli input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    setMessage(""); // Resetta i messaggi precedenti
    setIsError(false);

    // Validazione lato client: verifica che le password corrispondano
    if (formData.password !== formData.confirmPassword) {
      setMessage("Le password non corrispondono!");
      setIsError(true);
      return;
    }

    try {
      // Prepara i dati da inviare al backend.
      // Ora inviamo 'nome', 'cognome', 'email', 'password'
      const userData = {
        nome: formData.nome, // Corrisponde al campo nel backend
        cognome: formData.cognome, // Corrisponde al campo nel backend
        email: formData.email,
        password: formData.password,
      };

      // Chiama la funzione di registrazione API (che è già corretta in api.js)
      await registerUser(userData);

      setMessage(
        "Registrazione avvenuta con successo! Reindirizzamento al login..."
      );
      setIsError(false);
      // Reindirizza l'utente alla pagina di login dopo un breve ritardo
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 secondi di attesa
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      // Gestisci l'errore dalla risposta del backend
      // Cerca un messaggio specifico nell'errore della risposta (es. error.response.data.message)
      const errorMessage =
        error.response?.data?.message || "Errore di registrazione. Riprova.";
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
          <h2 className="text-center mb-4">Registrati</h2>
          {/* Mostra messaggi di errore o successo */}
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Campo Nome */}
            <Form.Group className="mb-3" controlId="formBasicNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo nome"
                name="nome" // Il nome deve corrispondere alla chiave in formData
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Campo Cognome */}
            <Form.Group className="mb-3" controlId="formBasicCognome">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo cognome"
                name="cognome" // Il nome deve corrispondere alla chiave in formData
                value={formData.cognome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Indirizzo Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci email"
                name="email" // Il nome deve corrispondere alla chiave in formData
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password" // Il nome deve corrispondere alla chiave in formData
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Conferma Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Conferma Password"
                name="confirmPassword" // Il nome deve corrispondere alla chiave in formData
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Registrati
            </Button>
          </Form>
          <p className="text-center mt-3">
            Hai già un account?{" "}
            <Button variant="link" onClick={() => navigate("/login")}>
              Accedi qui
            </Button>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;
