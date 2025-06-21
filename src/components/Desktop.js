import React, { useState, useEffect, useRef } from 'react';

import { shuffle } from 'lodash'

import Taskbar from './Taskbar';
import Icon from './Icon';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import fileIcon from '../logo.svg';
import dragonIcon from '../assets/dragon-color.png';
// import dragonIcon from '../assets/dragon2.jpeg';

import { ExclamationTriangleFill, FileEarmarkArrowDownFill, CheckCircleFill } from 'react-bootstrap-icons';

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

// ÚJ SEGÉDFÜGGVÉNY: Véletlenszerű ikonnevek generálásához
const generateRandomIconNames = (gridSize, totalCells) => {
  const names = {};
  // Generálunk több számot, mint ahány cella van, és összekeverjük, hogy véletlenszerűbb legyen
  const availableNumbers = shuffle(Array.from({ length: totalCells * 3 }, (_, i) => i + 1));
  let numIndex = 0;
  for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
          const uniqueId = `${r}-${c}`;
          const num = availableNumbers[numIndex % availableNumbers.length]; // Változó szám a kevert listából
          names[uniqueId] = `Akta ${String(num).padStart(2, '0')}`; // Formázás "Akta XX"
          numIndex++;
      }
  }
  return names;
};


function Desktop() {

  const gridSize = 5;
  const totalGridCells = gridSize * gridSize;

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
  const [isSolutionCorrect, setIsSolutionCorrect] = useState(false); // ÚJ: Megoldás helyességének állapota

  // ÚJ állapot a kurzor változtatásához
  const [isCustomCursor, setIsCustomCursor] = useState(false); // Kezdetben alapértelmezett kurzor

  // ÚJ: Állapot a globális időalapú változások leállítására
  const [areTimeBasedChangesStopped, setAreTimeBasedChangesStopped] = useState(false);

  // ÚJ Állapotok az időzítő modalhoz
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(25 * 60); // 25 perc másodpercben
  const [countdownMessage, setCountdownMessage] = useState('');
  const [isMainTimerActive, setIsMainTimerActive] = useState(true); // Szabályozza az időzítő működését

  // Ref, hogy nyomon kövessük, mikor jelent meg utoljára az 5 perces modal
  const lastFiveMinuteModalTimeRef = useRef(null);

  // Üzenet az Access Denied modalhoz, ami változhat
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("Hozzáférés megtagadva! A fájl felülvizsgálat alatt.");

   // ÚJ ÁLLAPOT: az ikonok neveinek tárolására
   const [iconNames, setIconNames] = useState({});

  // Kezdeti elrendezés beállítása (az első statikus véletlenszerű elrendezés)
  useEffect(() => {
    setCurrentLayoutMatrix(staticRandomLayouts[0]);
    setIconNames(generateRandomIconNames(gridSize, totalGridCells)); // Generáljuk a kezdeti neveket is
  }, [totalGridCells]);

  // ÚJ: useEffect, ami leállítja az összes időzítőt és beállítja a végső elrendezést
  useEffect(() => {
    if (areTimeBasedChangesStopped) {
        setIsMainTimerActive(false); // Leállítja a fő visszaszámlálót
        setIsCustomCursor(false); // Visszaállítja az alap kurzort (ezt a saját useEffectje kezeli)
        
        // Beállítja az elrendezést az első randomizáltra
        setCurrentLayoutMatrix(staticRandomLayouts[0]);
        setIconNames(generateRandomIconNames(gridSize, totalGridCells)); // Generálunk új neveket a rögzített elrendezéshez
    }
  }, [areTimeBasedChangesStopped, totalGridCells]); // Ez az useEffect akkor fut le, ha a flag változik

  // Layout váltás időzítő
  useEffect(() => {
    let layoutInterval;
    // Csak akkor fut, ha nincsenek leállítva az időalapú változások
    if (!areTimeBasedChangesStopped) {
      layoutInterval = setInterval(() => {

        // Döntés véletlenszerűen, melyik tömböt használjuk
        // Pl. 60% esély a számmintákra, 40% esély a random mintákra
        const useNumberPattern = Math.random() < 0.6;

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
          setIconNames(generateRandomIconNames(gridSize, totalGridCells)); // Új nevek generálása az új elrendezéshez
        }
      }, 10000); // 5 másodpercenként vált
    }

    return () => clearInterval(layoutInterval);
  }, [patternIndex, randomLayoutIndex, areTimeBasedChangesStopped, totalGridCells]); // Függőségek frissítve

   // ÚJ: Kurzort változtató useEffect
   useEffect(() => {
    const cursorInterval = setInterval(() => {
      setIsCustomCursor(prev => !prev); // Váltás az egyedi és alapértelmezett kurzor között
    }, 2000); // Váltás 2 másodpercenként

    return () => clearInterval(cursorInterval); // Tisztítás komponens eltávolításakor
  }, []);

  useEffect(() => {
    if (isCustomCursor && !areTimeBasedChangesStopped) {
      // Kérlek, cseréld ki a '/my-cursor.png' részt a saját kurzorképed elérési útjára
      // Helyezd a 'my-cursor.png' fájlt a 'public' mappába a projekt gyökerében
      document.body.style.cursor = `url('/flame.png'), auto`;
    } else {
      document.body.style.cursor = 'auto'; // Alapértelmezett kurzor
    }
  }, [isCustomCursor, areTimeBasedChangesStopped]);

   // ÚJ: Fő időzítő és 5 perces modal trigger
   useEffect(() => {
    if (!isMainTimerActive || countdownTime <= 0 || areTimeBasedChangesStopped) {
        if (countdownTime === 0 && isMainTimerActive && !areTimeBasedChangesStopped) { // Az időzítő épp most érte el a 0-át
            setIsMainTimerActive(false); // Leállítjuk az időzítőt
            setAreTimeBasedChangesStopped(true);
            setIsCountdownModalOpen(true);
            setCountdownMessage("Letöltés befejezve! Teljes hozzáférés megadva!"); // Végső üzenet
            // A végső üzenet modalja nem záródik be automatikusan
        }
        return; // Nem indítjuk el az intervallumot, ha nem aktív vagy már lejárt
    }

    const timerInterval = setInterval(() => {
        setCountdownTime(prevTime => {
            const newTime = prevTime - 1;

            // Trigger 5 perces periodikus modal
            // Akkor váltódik ki, ha az idő egy 5 perces (300 másodperces) többszöröse, és nem 0.
            // Például: 20 perc (1200 mp), 15 perc (900 mp), 10 perc (600 mp), 5 perc (300 mp)
            if (newTime > 0 && newTime % (5 * 60) === 0) {
                // Győződjünk meg róla, hogy csak egyszer váltódik ki per intervallum
                const triggerPoint = newTime;
                if (lastFiveMinuteModalTimeRef.current !== triggerPoint) {
                    setIsCountdownModalOpen(true);
                    const minutesLeft = Math.floor(newTime / 60);
                    setCountdownMessage(`Teljes hozzáférés megadásáig ${minutesLeft} perc maradt. Ne indítsa újra a rendszert!`);
                    lastFiveMinuteModalTimeRef.current = triggerPoint; // Frissítjük a referenciát

                    // Automatikusan elrejti a modalt 10 másodperc után
                    setTimeout(() => {
                        setIsCountdownModalOpen(false);
                        setCountdownMessage('');
                    }, 10000);
                }
            }

            return newTime;
        });
    }, 1000);

    return () => clearInterval(timerInterval); // Tisztítás komponens eltávolításakor vagy függőség változásakor
  }, [isMainTimerActive, countdownTime, areTimeBasedChangesStopped]); // Függőségek

  // Segédfüggvény az idő formázásához MM:SS formátumban
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleIconClick = () => {
    if (isSolutionCorrect) {
        setAccessDeniedMessage("A művelet sikeresen végrehajtva! A rendszer védett."); // Más üzenet
        setIsAccessDeniedOpen(true);
    } else {
        setAccessDeniedMessage("Hozzáférés megtagadva! A fájl felülvizsgálat alatt."); // Eredeti üzenet
        setIsAccessDeniedOpen(true);
    }
  };

   // ÚJ: Megoldás gomb kattintásának kezelése
   const handleSolutionButtonClick = () => {
    // Ha már leálltak a változások, ne nyissa meg a solution modalt
    if (areTimeBasedChangesStopped) {
      return;
    }
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
      setIsSolutionCorrect(true); // Megoldás helyes, beállítjuk az állapotot
      setAreTimeBasedChangesStopped(true); // Leállítjuk az ÖSSZES időalapú változást
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
        const iconName = iconNames[`${r}-${c}`] || `Akta --`; // Lekérjük a generált nevet

        colsInRow.push(
          <Col key={uniqueKey} xs={2} className="d-flex justify-content-center">
            {hasIcon ? ( // Ha van ikon (true a mátrixban)
              <Icon
                name={iconName}
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

      // Az extra sor ikonja csak akkor jelenik meg, ha nincs leállítva a rendszer
      const showIcon = !areTimeBasedChangesStopped && currentPatternType === 'number' && i === currentNumberKeyIndex;
      

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
          {isSolutionCorrect ? (
            <Modal.Title> <CheckCircleFill /> Sikeres művelet </Modal.Title>
          ) : (
            <Modal.Title> <ExclamationTriangleFill /> HIBA! </Modal.Title>
          )}
          
        </Modal.Header>
        <Modal.Body>
          
        <p className={styles.errorText}>{accessDeniedMessage}</p>
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

       {/* ÚJ: Visszaszámláló Modal ablak */}
       <Modal show={isCountdownModalOpen} onHide={() => {
          // Csak akkor engedélyezzük a bezárást, ha nem a végső üzenet, vagy ha kifejezetten szükséges.
          // A végső üzenet (countdownTime === 0) nem záródik be automatikusan "Rendben" gombbal.
          if (countdownTime > 0) setIsCountdownModalOpen(false);
      }}>
          <Modal.Header closeButton={countdownTime > 0}> {/* Csak akkor jelenjen meg a bezárás gomb, ha nem a végső üzenet */}
              <Modal.Title><FileEarmarkArrowDownFill /> Letöltés</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
              <p className="fs-4 fw-bold">{countdownMessage}</p>
              {countdownTime > 0 && ( // Csak akkor jelenítjük meg az időt, ha még van idő
                  <p className="fs-1 fw-bold text-danger">{formatTime(countdownTime)}</p>
              )}
          </Modal.Body>
          <Modal.Footer>
              {countdownTime > 0 ? (
                  <Button variant="secondary" onClick={() => setIsCountdownModalOpen(false)}>
                      Rendben
                  </Button>
              ) : (
                  // // A végső üzenethez más gomb vagy nincs gomb, ha a felhasználó nem avatkozhat be
                  // <Button variant="danger" onClick={() => { /* Itt kezelheted a végső eseményt */ }}>
                  //     Értem
                  // </Button>
                  <div></div>
              )}
          </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Desktop;