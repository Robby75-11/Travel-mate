import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import { resetPassword } from "../api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      await resetPassword(token, newPassword);
      setMessage(
        "Password aggiornata con successo! Verrai reindirizzato al login."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setIsError(true);
      setMessage(error || "Errore nel reset della password.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h3 className="mb-3 text-center">Reimposta Password</h3>
          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci nuova password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100">
              Reimposta
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResetPassword;
