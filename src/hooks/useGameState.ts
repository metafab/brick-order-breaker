import { useState } from 'react';

export const useGameState = (totalBricks: number) => {
  const [bricks, setBricks] = useState<number[]>([]);
  const [revealedBricks, setRevealedBricks] = useState<boolean[]>([]);
  const [flippedBricks, setFlippedBricks] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [tempRevealedBrick, setTempRevealedBrick] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorBrick, setErrorBrick] = useState<number | null>(null);
  const [correctBrick, setCorrectBrick] = useState<number | null>(null);
  const [lives, setLives] = useState(10);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  return {
    bricks,
    setBricks,
    revealedBricks,
    setRevealedBricks,
    flippedBricks,
    setFlippedBricks,
    currentNumber,
    setCurrentNumber,
    tempRevealedBrick,
    setTempRevealedBrick,
    showConfetti,
    setShowConfetti,
    errorBrick,
    setErrorBrick,
    correctBrick,
    setCorrectBrick,
    lives,
    setLives,
    isGameFinished,
    setIsGameFinished,
    isGameLost,
    setIsGameLost
  };
};