import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [partenza, setPartenza] = useState("");
  const [destinazione, setDestinazione] = useState("");
  const [data, setData] = useState("");
  const [passeggeri, setPasseggeri] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ partenza, destinazione, data, passeggeri });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="search-bar-container shadow-sm p-3 rounded"
    >
      <Row className="g-2 align-items-end">
        <Col md={3}>
          <Form.Label>Partenza</Form.Label>
          <Form.Control
            type="text"
            placeholder="Città di partenza (per voli/viaggi)"
            value={partenza}
            onChange={(e) => setPartenza(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Destinazione</Form.Label>
          <Form.Control
            type="text"
            placeholder="Città o luogo"
            value={destinazione}
            onChange={(e) => setDestinazione(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Label>Viaggiatori</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={passeggeri}
            onChange={(e) => setPasseggeri(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button type="submit" variant="primary" className="w-100">
            <BsSearch /> Cerca
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
