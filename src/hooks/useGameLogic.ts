import { useRef, useEffect } from 'react';
import { shuffle } from 'lodash';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useGameState } from './game/useGameState';
import { generateRandomNumbers, getNextExpectedNumber } from './game/gameUtils';

const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;
const LEVEL_3_TIME_LIMIT = 30;
const LEVEL_5_MAX_LIVES = 10;

export const useGameLogic = (levelId: string | undefined, totalBricks: number) => {
  const { t } = useTranslation();
  const isLevel2 = levelId === "2";
  const isLevel3 = levelId === "3";
  const isLevel4 = levelId === "4";
  const isLevel5 = levelId === "5";
  const isLevel7 = levelId === "7";
  const isLevel8 = levelId === "8";
  const shouldResetOnError = isLevel2 || isLevel3 || isLevel4 || isLevel5 || isLevel8;

  const {
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
  } = useGameState(totalBricks, isLevel7);

  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleGameComplete = () => {
    stopTimer();
    setIsGameFinished(true);
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
    const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');
    
    if (levelId && !completedLevels.includes(Number(levelId)) && !isGameLost) {
      completedLevels.push(Number(levelId));
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      
      levelTimes[levelId] = isLevel3 ? LEVEL_3_TIME_LIMIT - timeLeft : timer;
      localStorage.setItem('levelTimes', JSON.stringify(levelTimes));
      setShowConfetti(true);
      const message = t('completedIn', { time: isLevel3 ? LEVEL_3_TIME_LIMIT - timeLeft : timer });
      toast.success(t('congratulations', { message }));
    }
  };

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    intervalRef.current = window.setInterval(() => {
      if (isLevel3) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver(t('gameOverTime'));
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

  const handleGameOver = (message: string) => {
    stopTimer();
    setIsGameFinished(true);
    setIsGameLost(true);
    toast.error(message);
  };

  const resetGame = () => {
    const numbers = isLevel7 ? generateRandomNumbers(totalBricks) : [...Array(totalBricks)].map((_, i) => i + 1);
    setBricks(shuffle(numbers));
    setRevealedBricks(new Array(totalBricks).fill(false));
    setFlippedBricks(new Array(totalBricks).fill(false));
    setCurrentNumber(Math.min(...numbers));
    setTempRevealedBrick(null);
    setShowConfetti(false);
    setErrorBrick(null);
    setCorrectBrick(null);
    setTimer(0);
    setTimeLeft(LEVEL_3_TIME_LIMIT);
    setLives(LEVEL_5_MAX_LIVES);
    setIsGameFinished(false);
    setIsGameLost(false);
    setStreak(0);
    stopTimer();
    startTimer();
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
    setStreak(prev => prev + 1);
    const newRevealedBricks = [...revealedBricks];
    newRevealedBricks[index] = true;
    setRevealedBricks(newRevealedBricks);
    
    const nextNumber = getNextExpectedNumber(bricks, currentNumber);
    if (nextNumber) {
      setCurrentNumber(nextNumber);
      if (streak >= 2) {
        toast.success(`🔥 ${streak + 1} Streak!`);
      } else {
        toast.success(t('correct', { number: nextNumber }));
      }
    } else {
      handleGameComplete();
    }

    timeoutRef.current = window.setTimeout(() => {
      resetBrickState(index);
    }, REVEAL_DURATION);
  };

  const handleIncorrectBrick = (index: number) => {
    setErrorBrick(index);
    setStreak(0);
    toast.error(t('wrong'));
    
    if (isLevel5) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        handleGameOver(t('gameOverLives'));
        return;
      }
    }

    if (shouldResetOnError) {
      setRevealedBricks(new Array(totalBricks).fill(false));
      setCurrentNumber(Math.min(...bricks));
      toast.error(t('resetOnError'));
    }

    timeoutRef.current = window.setTimeout(() => {
      resetBrickState(index);
    }, ERROR_DURATION);
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

  useEffect(() => {
    resetGame();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentNumber === Math.min(...bricks) && !isGameFinished) {
      startTimer();
    }
  }, [currentNumber, isGameFinished, bricks]);

  useEffect(() => {
    if (isLevel3 && timeLeft === 0 && !isGameFinished) {
      handleGameOver(t('gameOverTime'));
    }
    if (isLevel5 && lives === 0 && !isGameFinished) {
      handleGameOver(t('gameOverLives'));
    }
  }, [timeLeft, lives, isLevel3, isLevel5, isGameFinished]);

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
    streak,
    handleBrickClick,
    resetGame
  };
};