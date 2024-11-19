import { useRef, useEffect } from 'react';

export const useGameTimer = (
  isLevel3: boolean,
  isGameFinished: boolean,
  handleGameOver: (message: string) => void,
  setTimeLeft: (fn: (prev: number) => number) => void,
  setTimer: (fn: (prev: number) => number) => void,
) => {
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    intervalRef.current = window.setInterval(() => {
      if (isLevel3) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver('Time\'s up!');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { startTimer, stopTimer };
};