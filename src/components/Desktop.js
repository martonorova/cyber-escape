import React, { useState, useEffect } from 'react';

import { shuffle } from 'lodash'

import Taskbar from './Taskbar';
import Icon from './Icon';
import ScreenVibration from './ScreenVibration';
import KeyboardScramble from './KeyboardScramble';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
// import fileIcon from './assets/file-icon.png';
// import terminalIcon from './assets/terminal-icon.png';
// import riddleIcon from './assets/riddle-icon.png';
import fileIcon from '../logo.svg';
import terminalIcon from '../logo.svg';
import riddleIcon from '../logo.svg';

// import './Desktop.css'; // Tartsd meg az egyedi Desktop stílusokat (háttér stb.)
import styles from './Desktop.module.scss';

function Desktop() {
  const realIconsData = [
    // IDs must be unique
    { id: 'files', name: 'Files', icon: fileIcon },
    { id: 'terminal', name: 'Terminal', icon: terminalIcon },
    { id: 'riddle1', name: 'Secret Note', icon: riddleIcon },
    { id: 'files2', name: 'Files', icon: fileIcon },
    // { id: 'terminal', name: 'Terminal', icon: terminalIcon },
    // { id: 'riddle1', name: 'Secret Note', icon: riddleIcon },
    // { id: 'files', name: 'Files', icon: fileIcon },
    // { id: 'terminal', name: 'Terminal', icon: terminalIcon },
    // { id: 'riddle1', name: 'Secret Note', icon: riddleIcon },
    // { id: 'files', name: 'Files', icon: fileIcon },
    // { id: 'terminal', name: 'Terminal', icon: terminalIcon },
    // { id: 'riddle1', name: 'Secret Note', icon: riddleIcon },
    // { id: 'files', name: 'Files', icon: fileIcon },
    // { id: 'terminal', name: 'Terminal', icon: terminalIcon },
    // { id: 'riddle1', name: 'Secret Note', icon: riddleIcon },
    // További ikonok hozzáadhatók itt
  ];

  const numberOfIcons = 4;
  const iconsPerRow = 2; // Állítsd be, hogy hány ikon legyen egy sorban

  // const [icons, setIcons] = useState(initialIcons.map(icon => ({ ...icon, isBlocked: false })));
  const [icons, setIcons] = useState(generateScatteredIcons(realIconsData, numberOfIcons));
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRiddle1Open, setIsRiddle1Open] = useState(false);



  // useEffect(() => {
  //   const blockInterval = setInterval(() => {
  //     // rearrange icons
  //     // setIcons(shuffle(icons))

  //     setIcons(prevIcons => {
  //       return shuffle(prevIcons)
  //     })

  //   }, 5000);

  //   return () => clearInterval(blockInterval);
  // }, []);

  // useEffect(() => {
  //   const blockInterval = setInterval(() => {
  //     // block icons randomly
  //     setIcons((prevIcons) =>
  //       prevIcons.map((icon) => ({
  //         ...icon,
  //         isBlocked: Math.random() < 0.3,
  //       }))
  //     );
  //   }, 7000);

  //   return () => clearInterval(blockInterval);
  // }, []);

  const handleIconClick = (iconName) => {
    if (iconName === 'Files') setIsFileExplorerOpen(true);
    if (iconName === 'Terminal') setIsTerminalOpen(true);
    if (iconName === 'Secret Note') setIsRiddle1Open(true);
  };

  function generateScatteredIcons(realIcons, totalIcons) {
    // const scatteredIcons = [];
    const realIconsWithData = realIcons.map(icon => ({ ...icon, isBlocked: false, isDummy: false }));
    const dummyIcons = Array.from({ length: totalIcons - realIcons.length }, (_, i) => ({
      id: `dummy-${Math.random()}`, // Fontos: egyedi ID minden dummy ikonhoz az átrendezéskor
      name: '',
      icon: null,
      isBlocked: false,
      isDummy: true,
    }));

    const allIcons = [...realIconsWithData, ...dummyIcons];
    const shuffledIcons = shuffle(allIcons);
    return shuffledIcons;
  }

  const renderIconsInGrid = () => {
    const rows = [];
    for (let i = 0; i < icons.length; i += iconsPerRow) {
      const iconsInRow = icons.slice(i, i + iconsPerRow);
      rows.push(
        <Row key={i} className="gx-3 gy-5 no-row-margin-top"> {/* gx- a vízszintes, gy- a függőleges távolság */}
          {iconsInRow.map((icon, index) => (
            <Col key={icon.id} xs={12 / iconsPerRow} className="d-flex justify-content-center">
              <Icon
                name={icon.name}
                icon={icon.icon}
                isBlocked={icon.isBlocked}
                isDummy={icon.isDummy}
                className={`${icon.isBlocked ? 'blocked' : ''} ${icon.isDummy ? 'dummy-icon' : ''}`}
                onClick={icon.isDummy ? undefined : () => handleIconClick(icon.name)}
              />
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

  const [terminalInput, setTerminalInput] = useState(''); // State a terminál beviteli mezőhöz

  const handleTerminalInputChange = (event) => {
    setTerminalInput(event.target.value);
  };

  return (
    <div className="desktop"> {/* Egyszerű div a háttérhez stb. */}
      <ScreenVibration>
      </ScreenVibration>

      <KeyboardScramble />
      <Container fluid className="mt-3"> {/* Container a margóhoz felül */}
        {renderIconsInGrid()}
      </Container>

      <Modal show={isFileExplorerOpen} onHide={() => setIsFileExplorerOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>File Explorer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Simulated file listings will go here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsFileExplorerOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isTerminalOpen} onHide={() => setIsTerminalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Terminal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.terminalContainer}> {/* Opcionális konténer a további stílushoz */}
            <label className={styles.terminalPrompt}>user@virtual:~$ </label>
            <textarea
              className={styles.terminalInput}
              value={terminalInput}
              onChange={handleTerminalInputChange}
              rows={5} // Állítsd be a kívánt sorok számát
            />
          </div>
          {/* Itt jelenítheted meg a terminál kimenetét */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsTerminalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => console.log('Command submitted:', terminalInput)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isRiddle1Open} onHide={() => setIsRiddle1Open(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Secret Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This is a secret note with a riddle!</p>
          {/* Itt lesz az első rejtvény */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsRiddle1Open(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Taskbar />
    </div>
  );
}

export default Desktop;