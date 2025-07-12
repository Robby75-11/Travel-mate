import React from "react";
import { Form, Row, Col } from "react-bootstrap";

function SearchBar({ searchTerm, onSearchChange, searchBy, onSearchByChange }) {
  return (
    <Form className="mb-4">
      <Row className="g-2">
        <Col xs={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Cerca per nome, città..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Form.Select
            value={searchBy}
            onChange={(e) => onSearchByChange(e.target.value)}
          >
            <option value="nome">Nome</option>
            <option value="indirizzo">Indirizzo</option>
            <option value="prezzo">Prezzo</option>
          </Form.Select>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
