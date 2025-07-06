import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getAllHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  uploadHotelImage,
} from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminHotelManagementPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    indirizzo: "",
    citta: "",
    descrizione: "",
    prezzoNotte: "",
  });
  const [imageFileOnForm, setImageFileOnForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [showImageModal, setShowImageModal] = useState(false);
  const [hotelForImage, setHotelForImage] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllHotels();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Errore nel caricare gli hotel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "AMMINISTRATORE") {
      setError("Accesso negato.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      fetchHotels();
    }
  }, [isAuthenticated, userRole, navigate, fetchHotels]);

  // Form modal handlers
  const openFormModal = (hotel = null) => {
    setCurrentHotel(hotel);
    setFormData({
      nome: hotel?.nome || "",
      indirizzo: hotel?.indirizzo || "",
      citta: hotel?.citta || "",
      descrizione: hotel?.descrizione || "",
      prezzoNotte: hotel?.prezzoNotte || "",
    });
    setImageFileOnForm(null);
    setFormMessage("");
    setShowFormModal(true);
  };
  const closeFormModal = () => {
    setShowFormModal(false);
    setCurrentHotel(null);
  };
  const onFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };
  const onFormFileChange = (e) => {
    setImageFileOnForm(e.target.files[0]);
  };
  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMessage("");
    try {
      let result;
      const payload = {
        nome: formData.nome,
        indirizzo: formData.indirizzo,
        citta: formData.citta,
        descrizione: formData.descrizione,
        prezzoNotte: parseFloat(formData.prezzoNotte),
      };
      if (currentHotel) {
        result = await updateHotel(currentHotel.id, payload);
      } else {
        result = await createHotel(payload);
      }
      if (imageFileOnForm) {
        await uploadHotelImage(result.id, imageFileOnForm);
      }
      setFormMessage("Salvataggio avvenuto!");
      await fetchHotels();
      setTimeout(closeFormModal, 1000);
    } catch (err) {
      setFormMessage("Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  };

  // Image modal handlers
  const openImageModal = (hotel) => {
    setHotelForImage(hotel);
    setImageToUpload(null);
    setUploadMessage("");
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setHotelForImage(null);
  };
  const onImageChange = (e) => {
    setImageToUpload(e.target.files[0]);
  };
  const submitImage = async (e) => {
    e.preventDefault();
    if (!imageToUpload) {
      setUploadMessage("Seleziona file");
      return;
    }
    setUploading(true);
    setUploadMessage("");
    try {
      await uploadHotelImage(hotelForImage.id, imageToUpload);
      setUploadMessage("Upload riuscito!");
      await fetchHotels();
      setTimeout(closeImageModal, 1000);
    } catch (err) {
      setUploadMessage("Errore durante upload");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <Button
        onClick={() => openFormModal()}
        className="mb-3"
        variant="success"
      >
        Aggiungi Hotel
      </Button>
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Prezzo</th>
            <th>Immagine</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.nome}</td>
              <td>{h.indirizzo}</td>
              <td>{h.citta}</td>
              <td>€{h.prezzoNotte.toFixed(2)}</td>
              <td>
                {h.immagineUrl ? (
                  <img
                    src={h.immagineUrl}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    alt=""
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openFormModal(h)}
                >
                  Modifica
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteHotel(h.id).then(fetchHotels)}
                >
                  Elimina
                </Button>{" "}
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => openImageModal(h)}
                >
                  Carica Immagine
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Form Modal */}
      <Modal show={showFormModal} onHide={closeFormModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentHotel ? "Modifica Hotel" : "Nuovo Hotel"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formMessage && (
            <Alert
              variant={formMessage.includes("Errore") ? "danger" : "success"}
            >
              {formMessage}
            </Alert>
          )}
          <Form onSubmit={submitForm}>
            {/* campi */}
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                name="nome"
                required
                onChange={onFormChange}
                value={formData.nome}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                name="indirizzo"
                required
                onChange={onFormChange}
                value={formData.indirizzo}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Città</Form.Label>
              <Form.Control
                name="citta"
                required
                onChange={onFormChange}
                value={formData.citta}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                name="descrizione"
                required
                onChange={onFormChange}
                value={formData.descrizione}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prezzo/notte</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="prezzoNotte"
                required
                onChange={onFormChange}
                value={formData.prezzoNotte}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Immagine (opzionale)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={onFormFileChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
              className="w-100 mt-2"
            >
              {saving ? <Spinner size="sm" /> : "Salva Hotel"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Carica Immagine per "{hotelForImage?.nome}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadMessage && (
            <Alert
              variant={uploadMessage.includes("Errore") ? "danger" : "success"}
            >
              {uploadMessage}
            </Alert>
          )}
          <Form onSubmit={submitImage}>
            <Form.Group>
              <Form.Label>Seleziona file</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                required
                onChange={onImageChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={uploading}
              className="w-100 mt-2"
            >
              {uploading ? <Spinner size="sm" /> : "Carica Immagine"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminHotelManagementPage;
