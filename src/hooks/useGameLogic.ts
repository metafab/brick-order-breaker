import { useState, useRef, useEffect } from 'react';
import { shuffle } from 'lodash';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useGameTimer } from './useGameTimer';
import { useGameState } from './useGameState';

const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;

export const useGameLogic = (levelId: string | undefined, totalBricks: number) => {
  const { t } = useTranslation();
  const timeoutRef = useRef<number | null>(null);
  
  const {
    timer,
    timeLeft,
    startTimer,
    stopTimer,
    intervalRef
  } = useGameTimer(levelId);

  const {
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
  } = useGameState(totalBricks);

  const handleGameComplete = () => {
    stopTimer();
    setIsGameFinished(true);
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
    const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');
    
    if (levelId && !completedLevels.includes(Number(levelId)) && !isGameLost) {
      completedLevels.push(Number(levelId));
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      
      levelTimes[levelId] = timer;
      localStorage.setItem('levelTimes', JSON.stringify(levelTimes));
      setShowConfetti(true);
      const message = t('completedIn', { time: timer });
      toast.success(t('congratulations', { message }));
    }
  };

  const handleGameOver = (message: string) => {
    stopTimer();
    setIsGameFinished(true);
    setIsGameLost(true);
    toast.error(message);
  };

  const resetGame = () => {
    const isLevel7 = levelId === "7";
    let numbers;
    
    if (isLevel7) {
      numbers = Array.from({ length: totalBricks }, () => 
        Math.floor(Math.random() * 100) + 1
      ).sort((a, b) => a - b);
    } else {
      numbers = [...Array(totalBricks)].map((_, i) => i + 1);
    }
    
    setBricks(shuffle(numbers));
    setRevealedBricks(new Array(totalBricks).fill(false));
    setFlippedBricks(new Array(totalBricks).fill(false));
    setCurrentNumber(isLevel7 ? Math.min(...numbers) : 1);
    setTempRevealedBrick(null);
    setShowConfetti(false);
    setErrorBrick(null);
    setCorrectBrick(null);
    setLives(10);
    setIsGameFinished(false);
    setIsGameLost(false);
    stopTimer();
    startTimer();
  };

  const resetBrickState = (index: number) => {
    setErrorBrick(null);
    setCorrectBrick(null);
    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = false;
      return newFlipped;
    });
    setTempRevealedBrick(null);
  };

  const handleBrickClick = (index: number) => {
    if (revealedBricks[index] || isGameLost) return;

    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });
    setTempRevealedBrick(index);

    if (bricks[index] === currentNumber) {
      handleCorrectBrick(index);
    } else {
      handleIncorrectBrick(index);
    }
  };

  const handleCorrectBrick = (index: number) => {
    setCorrectBrick(index);
    const newRevealedBricks = [...revealedBricks];
    newRevealedBricks[index] = true;
    setRevealedBricks(newRevealedBricks);
    
    const nextNumber = Math.min(...bricks.filter(num => num > currentNumber));
    setCurrentNumber(nextNumber);

    if (newRevealedBricks.every(revealed => revealed)) {
      handleGameComplete();
    } else {
      toast.success(t('correct', { number: nextNumber }));
    }

    timeoutRef.current = window.setTimeout(() => {
      resetBrickState(index);
    }, REVEAL_DURATION);
  };

  const handleIncorrectBrick = (index: number) => {
    setErrorBrick(index);
    toast.error(t('wrong'));
    
    timeoutRef.current = window.setTimeout(() => {
      resetBrickState(index);
    }, ERROR_DURATION);
  };

  useEffect(() => {
    resetGame();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    bricks,
    revealedBricks,
    flippedBricks,
    tempRevealedBrick,
    showConfetti,
    errorBrick,
    correctBrick,
    timer,
    timeLeft,
    lives,
    isGameFinished,
    isGameLost,
    handleBrickClick,
    resetGame
  };
};