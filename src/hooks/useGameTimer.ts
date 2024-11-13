import { useState, useRef } from 'react';

export const useGameTimer = (levelId: string | undefined) => {
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    intervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    timer,
    timeLeft,
    startTimer,
    stopTimer,
    intervalRef
  };
};