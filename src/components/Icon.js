import React from 'react';
import { Card, Col } from 'react-bootstrap';

// import './Icon.css'
import styles from './Icon.module.scss'; 

function Icon({ name, style, className, onClick, icon, isBlocked, isDummy }) {
  const handleClick = (event) => {
    if (!isBlocked && onClick) {
      onClick(event);
    }
  };

  if (isDummy) {
    return <Col style={{ width: '100px', height: '100px' }} />; // Foglaljon helyet, de ne jelenítsen meg semmit
  }

  return (
    <Card
      className={`${styles.card} desktop-icon ${className}`}
      style={{ ...style, width: '100px', height: '100px' }} // Fix méretek a kártyához
      onClick={handleClick}
    >
      {icon && (
        <Card.Img
          variant="top"
          src={icon}
          alt={name}
          style={{ width: '48px', height: '48px', margin: 'auto', marginTop: '5px' }}
        />
      )}
      <Card.Body className="d-flex flex-column justify-content-center align-items-center p-1">
        <Card.Title className="text-center fs-6 mb-0">{name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default Icon;