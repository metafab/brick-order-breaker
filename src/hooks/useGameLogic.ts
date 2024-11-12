import { useState, useRef, useEffect } from 'react';
import { shuffle } from 'lodash';
import { toast } from "sonner";

const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;
const LEVEL_3_TIME_LIMIT = 30;
const LEVEL_5_MAX_LIVES = 10;

export const useGameLogic = (levelId: string | undefined, totalBricks: number) => {
  const [bricks, setBricks] = useState<number[]>([]);
  const [revealedBricks, setRevealedBricks] = useState<boolean[]>([]);
  const [flippedBricks, setFlippedBricks] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [tempRevealedBrick, setTempRevealedBrick] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorBrick, setErrorBrick] = useState<number | null>(null);
  const [correctBrick, setCorrectBrick] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_3_TIME_LIMIT);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [lives, setLives] = useState(LEVEL_5_MAX_LIVES);
  const [isGameLost, setIsGameLost] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const isLevel2 = levelId === "2";
  const isLevel3 = levelId === "3";
  const isLevel4 = levelId === "4";
  const isLevel5 = levelId === "5";
  const shouldResetOnError = isLevel2 || isLevel3 || isLevel4 || isLevel5;

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
      toast.success(`Félicitations ! ${isLevel3 ? `Vous avez terminé le niveau en ${LEVEL_3_TIME_LIMIT - timeLeft} secondes !` : `Vous avez terminé le jeu en ${timer} secondes !`}`);
    }
  };

  const handleGameOver = (message: string) => {
    stopTimer();
    setIsGameFinished(true);
    setIsGameLost(true);
    toast.error(`Game Over ! ${message}`);
  };

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    intervalRef.current = window.setInterval(() => {
      if (isLevel3) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
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

  const resetGame = () => {
    setBricks(shuffle([...Array(totalBricks)].map((_, i) => i + 1)));
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
    const newRevealedBricks = [...revealedBricks];
    newRevealedBricks[index] = true;
    setRevealedBricks(newRevealedBricks);
    setCurrentNumber(currentNumber + 1);

    if (currentNumber === totalBricks) {
      handleGameComplete();
    } else {
      toast.success(`Correct ! Trouvez maintenant le numéro ${currentNumber + 1}.`);
    }

    timeoutRef.current = window.setTimeout(() => {
      resetBrickState(index);
    }, REVEAL_DURATION);
  };

  const handleIncorrectBrick = (index: number) => {
    setErrorBrick(index);
    toast.error("Oups ! Mauvaise brique. Essayez encore.");
    
    if (isLevel5) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        handleGameOver("Plus de vies !");
        return;
      }
    }
    
    if (shouldResetOnError) {
      setRevealedBricks(new Array(totalBricks).fill(false));
      setCurrentNumber(1);
      toast.error("Tout est caché à nouveau ! Recommencez depuis le début.");
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
    if (currentNumber === 1 && !isGameFinished) {
      startTimer();
    }
    if (currentNumber > totalBricks) {
      handleGameComplete();
    }
  }, [currentNumber, isGameFinished]);

  useEffect(() => {
    if (isLevel3 && timeLeft === 0 && !isGameFinished) {
      handleGameOver("Temps écoulé !");
    }
    if (isLevel5 && lives === 0 && !isGameFinished) {
      handleGameOver("Plus de vies !");
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
    handleBrickClick,
    resetGame
  };
};