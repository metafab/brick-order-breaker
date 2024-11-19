import { useEffect } from 'react';
import { shuffle } from 'lodash';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useGameState } from './game/useGameState';
import { useGameTimer } from './game/useGameTimer';
import { useBrickHandling } from './game/useBrickHandling';
import { generateRandomNumbers } from './game/gameUtils';
import { generateMathExpressions, generateTimes, generateMixedSymbols } from '@/utils/levelUtils';

const LEVEL_3_TIME_LIMIT = 30;
const LEVEL_5_MAX_LIVES = 10;

export const useGameLogic = (levelId: string | undefined, totalBricks: number) => {
  const { t } = useTranslation();
  const isLevel3 = levelId === "3";
  const isLevel5 = levelId === "5";
  const isLevel7 = levelId === "7";
  const isLevel9 = levelId === "9";
  const isLevel10 = levelId === "10";
  const isLevel11 = levelId === "11";

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

  const handleGameOver = (message: string) => {
    stopTimer();
    setIsGameFinished(true);
    setIsGameLost(true);
    toast.error(t(message));
  };

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
      toast.success(t('congratulations', { 
        message: t('completedIn', { time: isLevel3 ? LEVEL_3_TIME_LIMIT - timeLeft : timer })
      }));
    }
  };

  const { startTimer, stopTimer } = useGameTimer(
    isLevel3,
    isGameFinished,
    handleGameOver,
    setTimeLeft,
    setTimer
  );

  const { handleBrickClick, timeoutRef } = useBrickHandling(
    levelId,
    bricks,
    revealedBricks,
    setRevealedBricks,
    setFlippedBricks,
    currentNumber,
    setCurrentNumber,
    setTempRevealedBrick,
    setErrorBrick,
    setCorrectBrick,
    setStreak,
    handleGameComplete,
    lives,
    setLives,
    handleGameOver
  );

  const resetGame = () => {
    let newBricks: (number | string)[];
    
    if (isLevel9) {
      newBricks = generateMathExpressions(totalBricks);
    } else if (isLevel10) {
      newBricks = generateTimes(totalBricks);
    } else if (isLevel11) {
      newBricks = generateMixedSymbols(totalBricks).map(s => s.display);
    } else if (isLevel7) {
      newBricks = generateRandomNumbers(totalBricks);
    } else {
      newBricks = [...Array(totalBricks)].map((_, i) => i + 1);
    }
    
    setBricks(shuffle(newBricks));
    setRevealedBricks(new Array(totalBricks).fill(false));
    setFlippedBricks(new Array(totalBricks).fill(false));
    setCurrentNumber(1);
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

  useEffect(() => {
    resetGame();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    streak,
    handleBrickClick,
    resetGame
  };
};