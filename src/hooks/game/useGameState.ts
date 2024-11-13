import { useState } from 'react';
import { shuffle } from 'lodash';

export const useGameState = (totalBricks: number, isLevel7: boolean) => {
  const [bricks, setBricks] = useState<number[]>([]);
  const [revealedBricks, setRevealedBricks] = useState<boolean[]>([]);
  const [flippedBricks, setFlippedBricks] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [tempRevealedBrick, setTempRevealedBrick] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorBrick, setErrorBrick] = useState<number | null>(null);
  const [correctBrick, setCorrectBrick] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lives, setLives] = useState(10);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [streak, setStreak] = useState(0);

  return {
    bricks, setBricks,
    revealedBricks, setRevealedBricks,
    flippedBricks, setFlippedBricks,
    currentNumber, setCurrentNumber,
    tempRevealedBrick, setTempRevealedBrick,
    showConfetti, setShowConfetti,
    errorBrick, setErrorBrick,
    correctBrick, setCorrectBrick,
    timer, setTimer,
    timeLeft, setTimeLeft,
    lives, setLives,
    isGameFinished, setIsGameFinished,
    isGameLost, setIsGameLost,
    streak, setStreak
  };
};