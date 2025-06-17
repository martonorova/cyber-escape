import React, { useState, useEffect } from 'react';

import { shuffle } from 'lodash'

import Taskbar from './Taskbar';
import Icon from './Icon';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import fileIcon from '../logo.svg';

import styles from './Desktop.module.scss';

// Segédfüggvény egy üres 6x6-os boolean mátrix létrehozásához
const createEmptyGrid = () => Array(6).fill(null).map(() => Array(6).fill(false));

// Statikus 6x6-os boolean mátrixok a számokhoz
const numberPatterns = {
  '8': [
    [false, true, true, true, false, false],
    [false, true, false, true, false, false],
    [false, true, true, true, false, false],
    [false, true, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, false, false, false],
  ],
  '5': [
    [false, true, true, true, false, false],
    [false, true, false, false, false, false],
    [false, true, true, true, false, false],
    [false, false, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, false, false, false],
  ],
  '3': [
    [false, true, true, true, false, false],
    [false, false, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, false, false, false],
  ],
  '9': [
    [false, true, true, true, false, false],
    [false, true, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, true, false, false],
    [false, true, true, true, false, false],
    [false, false, false, false, false, false],
  ],
  '7': [
    [false, true, true, true, false, false],
    [false, false, false, true, false, false],
    [false, false, false, true, false, false],
    [false, false, false, true, false, false],
    [false, false, false, true, false, false],
    [false, false, false, false, false, false],
  ],
};

// Segédfüggvény statikus véletlenszerű elrendezés generálásához
const generateStaticRandomLayout = (numIcons, totalCells) => {
  const grid = createEmptyGrid();
  const flatGrid = Array(totalCells).fill(false); // Lapos tömb a könnyebb kezeléshez

  const positions = shuffle(Array.from({ length: totalCells }, (_, i) => i)); // Összes pozíció
  for (let i = 0; i < numIcons; i++) {
    flatGrid[positions[i]] = true; // Jelöljük az ikont rejtő pozíciókat
  }

  // Alakítsuk vissza 6x6-os mátrixá
  let current = 0;
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      grid[r][c] = flatGrid[current++];
    }
  }
  return grid;
};

// 10 statikus, random elrendezés előre generálva
const staticRandomLayouts = Array.from({ length: 10 }, () =>
  generateStaticRandomLayout(13, 36)
);


function Desktop() {

  const gridSize = 6;

  const [currentLayoutMatrix, setCurrentLayoutMatrix] = useState([]); // A jelenlegi 6x6-os boolean mátrix
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0); // Index a számminták között
  const [randomLayoutIndex, setRandomLayoutIndex] = useState(0); // Index a random elrendezések között

  // Kezdeti elrendezés beállítása (az első statikus véletlenszerű elrendezés)
  useEffect(() => {
    setCurrentLayoutMatrix(staticRandomLayouts[0]);
  }, []);

  // Layout váltás időzítő
  useEffect(() => {
    const layoutInterval = setInterval(() => {

      // Döntés véletlenszerűen, melyik tömböt használjuk
      // Pl. 50% esély a számmintákra, 50% esély a random mintákra
      const useNumberPattern = Math.random() < 0.3;

      if (useNumberPattern) {
        // Válasszunk a számminták közül
        const numberKeys = Object.keys(numberPatterns);
        const nextIndex = (patternIndex + 1) % numberKeys.length;
        setPatternIndex(nextIndex);
        setCurrentLayoutMatrix(numberPatterns[numberKeys[nextIndex]]);
      } else {
        // Válasszunk a random elrendezések közül
        const nextIndex = (randomLayoutIndex + 1) % staticRandomLayouts.length;
        setRandomLayoutIndex(nextIndex);
        setCurrentLayoutMatrix(staticRandomLayouts[nextIndex]);
      }
    }, 5000); // 5 másodpercenként vált

    return () => clearInterval(layoutInterval);
  }, [patternIndex, randomLayoutIndex]); // Függőségek frissítve

  const handleIconClick = () => { // Nincs már iconName prop, mert mind File
    setIsAccessDeniedOpen(true);
  };

  const renderIconsInGrid = () => {
    const rows = [];
    for (let r = 0; r < gridSize; r++) {
      const colsInRow = [];
      for (let c = 0; c < gridSize; c++) {
        const hasIcon = currentLayoutMatrix[r] && currentLayoutMatrix[r][c]; // Ellenőrizzük, hogy van-e ikon
        const uniqueKey = `icon-${r}-${c}`; // Egyedi kulcs minden Col-hoz

        colsInRow.push(
          <Col key={uniqueKey} xs={2} className="d-flex justify-content-center">
            {hasIcon ? ( // Ha van ikon (true a mátrixban)
              <Icon
                name="File" // Mindig "File"
                icon={fileIcon}
                isDummy={false} // Nem dummy, mert látható File ikon
                onClick={handleIconClick}
                className=""
              />
            ) : ( // Ha nincs ikon (false a mátrixban)
              <Icon
                name=""
                icon={null} // Nincs kép
                isDummy={true} // Dummy ikon (helyfoglaló)
                onClick={undefined}
                className="dummy-icon" // Adhatunk neki egy osztályt a stílusozáshoz
              />
            )}
          </Col>
        );
      }
      rows.push(
        <Row key={r} className={`gx-3 gy-5 no-row-margin-top`}>
        {/* // <Row key={r} className={`justify-content-center ${styles.iconRow}`}> */}
          {colsInRow}
        </Row>
      );
    }
    return rows;
  };



  return (
    <div className={styles.desktop}>
      {/* <Container fluid className="mt-3"> */}
      <Container
        // fluid prop eltávolítva
        className="d-flex flex-column justify-content-center align-items-center" // Flexbox a tartalom középre igazításához
        style={{
          minHeight: 'calc(100vh - 50px)', // A taskbar magasságát levonjuk
          maxWidth: '850px', // Max szélesség beállítása
          width: '100%', // Kisebb képernyőn alkalmazkodik, max 850px
          padding: '0', // Eltávolítja a Bootstrap alapértelmezett paddingját
          margin: '0 auto' // Középre igazítja a konténert a szülő elemen belül
        }}
      >
        {renderIconsInGrid()}
      </Container>

      {/* Access Denied Modal */}
      <Modal show={isAccessDeniedOpen} onHide={() => setIsAccessDeniedOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={styles.errorText}>Access Denied</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsAccessDeniedOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Taskbar />
    </div>
  );
}

export default Desktop;