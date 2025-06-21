import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import tekeresLogo from '../small-logo.png';

function Taskbar({ onSolutionButtonClick }) {
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand>
          <img
            src={tekeresLogo}
            alt="Icon"
            style={{ width: '25px', marginRight: '10px' }}
          />
          Tekeres Agency Nyilvántartás
        </Navbar.Brand>
        <Button onClick={onSolutionButtonClick}>Rendszer Frissítés</Button>
      </Container>
    </Navbar>
  );
}

export default Taskbar;