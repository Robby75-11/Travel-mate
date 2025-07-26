import { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import { forgotPassword } from "../api"; // Assicurati che il percorso sia corretto

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      await forgotPassword(email);
      setMessage(
        "Se l'email è corretta, riceverai un link per reimpostare la password."
      );
    } catch (error) {
      setIsError(true);
      setMessage(error || "Errore durante la richiesta di reset.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h3 className="mb-3 text-center">Password dimenticata</h3>
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100">
              Invia link di reset
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
