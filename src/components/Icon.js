import React from 'react';
import { Card, Col } from 'react-bootstrap';

import styles from './Icon.module.scss'; 

function Icon({ name, style, className, onClick, icon, isDummy, isSpecialIcon }) {
  const handleClick = (event) => {
    if (onClick && !isDummy) {
      onClick(event);
    }
  };

  if (isDummy) {
    return <Col style={{ width: '100px', height: '100px' }} />; // Foglaljon helyet, de ne jelenítsen meg semmit
  }

  return (
    <Card
      className={`${styles.card} desktop-icon ${className} ${isSpecialIcon ? styles.specialIconOnly : ''}`}
      // style={{ ...style, width: '100px', height: '100px' }} // Fix méretek a kártyához
      onClick={handleClick}
    >
      {icon && ( // Csak akkor rendereli az ikont, ha az 'icon' prop létezik
        <Card.Img
          variant="top"
          src={icon}
          alt={name}
          // style={{ width: '48px', height: '48px', margin: '5px auto 2px', display: 'block' }}
        />
      )}
      {/* CSAK akkor rendereli a Card.Body-t, ha van 'name' prop */}
      {name && (
        <Card.Body className={`d-flex flex-column justify-content-center align-items-center p-1`}>
          <Card.Title className={`text-center fs-6 mb-0`}>{name}</Card.Title>
        </Card.Body>
      )}
    </Card>
  );
}

export default Icon;