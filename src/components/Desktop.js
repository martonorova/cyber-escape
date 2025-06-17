import React, { useState, useEffect } from 'react';

import { shuffle } from 'lodash'

import Taskbar from './Taskbar';
import Icon from './Icon';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import fileIcon from '../logo.svg';
import dragonIcon from '../assets/dragon.png';
// import dragonIcon from '../assets/dragon2.jpeg';

import { ExclamationTriangleFill } from 'react-bootstrap-icons';

import styles from './Desktop.module.scss';

// Segédfüggvény egy üres 5x5-os boolean mátrix létrehozásához
const createEmptyGrid = () => Array(5).fill(null).map(() => Array(5).fill(false));

// Statikus 5x5-ös boolean mátrixok a számokhoz (ÚJ DEFINÍCIÓ)
const numberPatterns = {
  '8': {
    matrix: [
      [false, true, true, true, false],
      [false, true, false, true, false],
      [false, true, true, true, false],
      [false, true, false, true, false],
      [false, true, true, true, false],
    ],
    position: 0
  },
  '5': {
    matrix: [
      [false, true, true, true, false],
      [false, true, false, false, false],
      [false, true, true, true, false],
      [false, false, false, true, false],
      [false, true, true, true, false],
    ],
    position: 1
  },
  '3': {
    matrix: [
      [false, true, true, true, false],
      [false, false, false, true, false],
      [false, true, true, true, false],
      [false, false, false, true, false],
      [false, true, true, true, false],
    ],
    position: 2
  },
  '9': {
    matrix: [
      [false, true, true, true, false],
      [false, true, false, true, false],
      [false, true, true, true, false],
      [false, false, false, true, false],
      [false, true, true, true, false],
    ],
    position: 3
  },
  '7': {
    matrix: [
      [false, true, true, true, false],
      [false, false, false, true, false],
      [false, false, false, true, false],
      [false, false, false, true, false],
      [false, false, false, true, false],
    ],
    position: 4
  },
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
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      grid[r][c] = flatGrid[current++];
    }
  }
  return grid;
};

// 10 statikus, random elrendezés előre generálva
const staticRandomLayouts = Array.from({ length: 10 }, () =>
  generateStaticRandomLayout(13, 25)
);


function Desktop() {

  const gridSize = 5;

  const [currentLayoutMatrix, setCurrentLayoutMatrix] = useState([]); // A jelenlegi 5x5-os boolean mátrix
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0); // Index a számminták között
  const [randomLayoutIndex, setRandomLayoutIndex] = useState(0); // Index a random elrendezések között

  // Új állapot a jelenleg megjelenített mintázat típusának tárolására
  const [currentPatternType, setCurrentPatternType] = useState('random'); // 'number' vagy 'random'
  const [currentNumberKeyIndex, setCurrentNumberKeyIndex] = useState(0); // A számminta tömbjének indexe

  // ÚJ állapot a megoldás ablakhoz
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionInputs, setSolutionInputs] = useState(Array(5).fill('')); // 5 üres string a bemeneteknek
  const [solutionMessage, setSolutionMessage] = useState(''); // Üzenet a megfejtéshez

  // ÚJ állapot a kurzor változtatásához
  const [isCustomCursor, setIsCustomCursor] = useState(false); // Kezdetben alapértelmezett kurzor

  // Kezdeti elrendezés beállítása (az első statikus véletlenszerű elrendezés)
  useEffect(() => {
    setCurrentLayoutMatrix(staticRandomLayouts[0]);
  }, []);

  // Layout váltás időzítő
  useEffect(() => {
    const layoutInterval = setInterval(() => {

      // Döntés véletlenszerűen, melyik tömböt használjuk
      // Pl. 50% esély a számmintákra, 50% esély a random mintákra
      const useNumberPattern = Math.random() < 0.5;

      if (useNumberPattern) {
        // Válasszunk a számminták közül
        const numberKeys = Object.keys(numberPatterns);
        const nextIndex = (patternIndex + 1) % numberKeys.length;
        const currentPattern = numberPatterns[numberKeys[nextIndex]]; // A teljes minta objektum lekérése
        setPatternIndex(nextIndex);
        setCurrentLayoutMatrix(currentPattern.matrix);
        setCurrentPatternType('number'); // Beállítjuk a típust 'number'-re
        setCurrentNumberKeyIndex(currentPattern.position); // Tároljuk a szám kulcsának indexét
      } else {
        // Válasszunk a random elrendezések közül
        const nextIndex = (randomLayoutIndex + 1) % staticRandomLayouts.length;
        setRandomLayoutIndex(nextIndex);
        setCurrentLayoutMatrix(staticRandomLayouts[nextIndex]);
        setCurrentPatternType('random'); // Beállítjuk a típust 'random'-ra
        setCurrentNumberKeyIndex(-1); // Nincs releváns index, ha random
      }
    }, 10000); // 5 másodpercenként vált

    return () => clearInterval(layoutInterval);
  }, [patternIndex, randomLayoutIndex]); // Függőségek frissítve

   // ÚJ: Kurzort változtató useEffect
   useEffect(() => {
    const cursorInterval = setInterval(() => {
      setIsCustomCursor(prev => !prev); // Váltás az egyedi és alapértelmezett kurzor között
    }, 2000); // Váltás 2 másodpercenként

    return () => clearInterval(cursorInterval); // Tisztítás komponens eltávolításakor
  }, []);

  useEffect(() => {
    if (isCustomCursor) {
      // Kérlek, cseréld ki a '/my-cursor.png' részt a saját kurzorképed elérési útjára
      // Helyezd a 'my-cursor.png' fájlt a 'public' mappába a projekt gyökerében
      console.log("Use flame")
      document.body.style.cursor = `url('/flame.png'), auto`;
    } else {
      document.body.style.cursor = 'auto'; // Alapértelmezett kurzor
    }
  }, [isCustomCursor]);

  const handleIconClick = () => { // Nincs már iconName prop, mert mind File
    setIsAccessDeniedOpen(true);
  };

   // ÚJ: Megoldás gomb kattintásának kezelése
   const handleSolutionButtonClick = () => {
    setIsSolutionModalOpen(true); // Megnyitja a megoldás ablakot
    setSolutionInputs(Array(5).fill('')); // Törli a korábbi bemeneteket
    setSolutionMessage(''); // Törli az üzenetet
  };

  // ÚJ: Megoldás input változásának kezelése
  const handleSolutionInputChange = (index, value) => {
    // Csak számot fogad el és csak egy karaktert
    if (value === '' || /^[0-9]$/.test(value)) {
      const newInputs = [...solutionInputs];
      newInputs[index] = value;
      setSolutionInputs(newInputs);
    }
  };

  // ÚJ: Megoldás ellenőrzése
  const checkSolution = () => {
    const correctSolution = '85397'; // A helyes megfejtés (az 5x5-ös minták sorrendje)
    const enteredSolution = solutionInputs.join(''); // A felhasználó által beírt szám

    if (enteredSolution === correctSolution) {
      setSolutionMessage('Letöltés megszakítva!');
    } else {
      setSolutionMessage('Hibás kód.');
    }
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
        <Row key={r} className={`gx-3 gy-5 no-row-margin-top mb-1`}>
        {/* // <Row key={r} className={`justify-content-center ${styles.iconRow}`}> */}
          {colsInRow}
        </Row>
      );
    }
    return rows;
  };

  // ÚJ FÜGGVÉNY A KIEGÉSZÍTŐ SOR RENDERELÉSÉHEZ
  const renderAdditionalRow = () => {
    const iconsInRow = [];
    const numberOfCols = 5; // 5 oszlop

    for (let i = 0; i < numberOfCols; i++) {

      // Csak akkor jelenítünk meg ikont, ha számmintát mutatunk,
      // ÉS az aktuális oszlop indexe megegyezik a számminta indexével
      const showIcon = currentPatternType === 'number' && i === currentNumberKeyIndex;

      iconsInRow.push(
        <Col key={`additional-icon-${i}`} xs={2} className="d-flex justify-content-center">
          {showIcon ? (
            <Icon
            name="" // Üres név, hogy ne jelenjen meg szöveg
            icon={dragonIcon} // Az új ikon kép
            isDummy={false}
            onClick={handleIconClick}
            isSpecialIcon={true}
          />
          ) : (
            // Dummy ikon, ha nincs aktív ikon ebben a pozícióban
            <Icon
              name=""
              icon={null}
              isDummy={true}
              onClick={undefined}
              className="dummy-icon"
            />
          )}
        </Col>
      );
    }

    return (
      <Row className={`justify-content-center`}> {/* mt-4 a fenti rácstól való távolság */}
        {iconsInRow}
      </Row>
    );
  };



  return (
    <div className={styles.desktop}>
      <Taskbar onSolutionButtonClick={handleSolutionButtonClick} />
      {/* <Container fluid className="mt-3"> */}
      <Container
        // fluid prop eltávolítva
        className="mt-3 d-flex flex-column justify-content-center align-items-center" // Flexbox a tartalom középre igazításához
        style={{
          minHeight: 'calc(100vh - 50px)', // A taskbar magasságát levonjuk
          maxWidth: '850px', // Max szélesség beállítása
          width: '100%', // Kisebb képernyőn alkalmazkodik, max 850px
          padding: '0', // Eltávolítja a Bootstrap alapértelmezett paddingját
          margin: '0 auto' // Középre igazítja a konténert a szülő elemen belül
        }}
      >
        {renderIconsInGrid()}
        {renderAdditionalRow()}
      </Container>

      {/* Access Denied Modal */}
      <Modal show={isAccessDeniedOpen} onHide={() => setIsAccessDeniedOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title> <ExclamationTriangleFill /> HIBA!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <p className={styles.errorText}>Hozzáférés megtagadva!</p>
          <p className={styles.errorText}>A fájl felülvizsgálat alatt.</p>
        </Modal.Body>
      </Modal>

      <Modal show={isSolutionModalOpen} onHide={() => setIsSolutionModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adja meg a jelszót!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex justify-content-around mb-3">
            {solutionInputs.map((digit, index) => (
              <Form.Control
                key={index}
                type="text" // text típus, hogy egyelőre ne jöjjön fel a numerikus billentyűzet mobilokon
                maxLength="1" // Csak egy karaktert engedélyez
                value={digit}
                onChange={(e) => handleSolutionInputChange(index, e.target.value)}
                className="text-center mx-1" // Középre igazítja a szöveget és ad egy kis margót
                style={{ width: '50px', height: '50px', fontSize: '2rem' }} // Nagyobb méret és betűméret
              />
            ))}
          </Form>
          {solutionMessage && <p className="text-center mt-3">{solutionMessage}</p>} {/* Megjeleníti az üzenetet */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsSolutionModalOpen(false)}>
            Mégse
          </Button>
          <Button variant="primary" onClick={checkSolution}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Desktop;