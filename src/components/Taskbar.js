import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Taskbar() {
  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Container>
        <Navbar.Brand>Cyber Escape</Navbar.Brand>
        {/* You can add more items to the taskbar later */}
      </Container>
    </Navbar>
  );
}

export default Taskbar;