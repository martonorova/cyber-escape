import React, { useState, useEffect } from 'react';

function ScreenVibration({ duration = 100, interval = 5000 }) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, duration);
    }, interval);

    return () => clearInterval(timer);
  }, [duration, interval]);

  return <div className={isShaking ? 'shake' : ''}>{/* No direct child needed here */}</div>;
}

export default ScreenVibration;