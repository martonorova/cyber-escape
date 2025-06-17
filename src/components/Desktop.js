import React, { useState, useEffect } from 'react';

import { shuffle } from 'lodash'

import Taskbar from './Taskbar';
import Icon from './Icon';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import fileIcon from '../logo.svg';
import dragonIcon from '../assets/dragon.png';
// import dragonIcon from '../assets/dragon2.jpeg';

import styles from './Desktop.module.scss';

// Segédfüggvény egy üres 6x6-os boolean mátrix létrehozásához
const createEmptyGrid = () => Array(6).fill(null).map(() => Array(6).fill(false));

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
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
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

  // Kezdeti elrendezés beállítása (az első statikus véletlenszerű elrendezés)
  useEffect(() => {
    setCurrentLayoutMatrix(staticRandomLayouts[0]);
  }, []);

  // Layout váltás időzítő
  useEffect(() => {
    const layoutInterval = setInterval(() => {

      // Döntés véletlenszerűen, melyik tömböt használjuk
      // Pl. 50% esély a számmintákra, 50% esély a random mintákra
      const useNumberPattern = Math.random() < 1.8;

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
    // Mivel 12 Bootstrap oszlop van, és 5 oszlopot akarunk,
    // 12 / 5 = 2.4. Ezért 2-es Col méretekkel nem lesz tökéletesen elosztva.
    // Helyette használhatunk xs={2} és justified-content-center-t, vagy xs={2} és xs={auto} kombinációt,
    // de a legegyszerűbb, ha xs={auto} és a Col-ok száma 5.
    // VAGY, ha fix méretű ikonjaink vannak (75px), akkor manuálisan kell elosztani 850px-en.
    // A 850px / 5 = 170px hely oszloponként, beleértve a guttert.
    // Ha az ikon 75px, akkor 170-75 = 95px marad a paddingra és a gutterre.

    // A legegyszerűbb, ha ragaszkodunk a Bootstrap Col-hoz, és hagyjuk, hogy elossza.
    // Használjunk xs={2} vagy xs={auto} és justifiy-content-around/between/center.
    // Maradjunk az xs={2}-nél, de az utolsó Col-t (vagy az elsőt) eltolhatjuk.
    // Vagy egyszerűen xs={auto} minden Col-nak, ami elosztja a rendelkezésre álló helyet.

    // A 850px szélesség 12 oszlopra van felosztva,
    // egy 6x6-os rácsban minden Col xs={2} szélességű.
    // 5 ikon a 850px-en belül. 850 / 5 = 170px / ikon + gutter.
    // Mivel az ikon 75px, 170 - 75 = 95px a keret.

    // A legtisztább, ha a Col xs értékét úgy választjuk meg, hogy 5 oszlop jöjjön ki:
    // 12 / 5 = 2.4. Nincs tökéletes Bootstrap xs érték.
    // Használjuk a justify-content-between/around-ot, és adjunk Col xs={2} vagy xs={auto}-t.
    // `xs={2}` esetén 6 oszlop van, de csak 5-öt használunk. A maradék helyet a justify-content-center osztja el.
    // A `Col` `xs={2}` ad kb. 16.66% szélességet. 5 * 16.66% = 83.3%.
    // Ez azt jelenti, hogy lesz 16.7% üres hely, amit a `justify-content-center` szépen eloszt.

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
      {/* <Container fluid className="mt-3"> */}
      <Container
        // fluid prop eltávolítva
        className="mt-1 d-flex flex-column justify-content-center align-items-center" // Flexbox a tartalom középre igazításához
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