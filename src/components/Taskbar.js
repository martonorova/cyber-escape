import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

function Taskbar({ onSolutionButtonClick }) {
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand>Tekeres Agency Nyilvántartás</Navbar.Brand>
        <Button onClick={onSolutionButtonClick}>Rendszer Frissítés</Button>
      </Container>
    </Navbar>
  );
}

export default Taskbar;