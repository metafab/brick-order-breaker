import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { shuffle } from 'lodash';
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

const TOTAL_BRICKS = 6;
const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;
const LEVEL_3_TIME_LIMIT = 30;

const CacheBrique: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();
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
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const isLevel2 = levelId === "2";
  const isLevel3 = levelId === "3";
  const shouldResetOnError = isLevel2 || isLevel3;

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
    if (currentNumber > TOTAL_BRICKS) {
      stopTimer();
      setIsGameFinished(true);
      const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
      const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');
      
      if (levelId && !completedLevels.includes(Number(levelId))) {
        completedLevels.push(Number(levelId));
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        
        // Store the completion time
        levelTimes[levelId] = isLevel3 ? LEVEL_3_TIME_LIMIT - timeLeft : timer;
        localStorage.setItem('levelTimes', JSON.stringify(levelTimes));
      }
    }
  }, [currentNumber, isGameFinished, levelId, timer, timeLeft, isLevel3]);

  useEffect(() => {
    if (isLevel3 && timeLeft === 0 && !isGameFinished) {
      handleGameOver();
    }
  }, [timeLeft, isLevel3, isGameFinished]);

  const handleGameOver = () => {
    stopTimer();
    setIsGameFinished(true);
    toast.error("Temps écoulé ! Vous avez perdu.");
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
    setBricks(shuffle([...Array(TOTAL_BRICKS)].map((_, i) => i + 1)));
    setRevealedBricks(new Array(TOTAL_BRICKS).fill(false));
    setFlippedBricks(new Array(TOTAL_BRICKS).fill(false));
    setCurrentNumber(1);
    setTempRevealedBrick(null);
    setShowConfetti(false);
    setErrorBrick(null);
    setCorrectBrick(null);
    setTimer(0);
    setTimeLeft(LEVEL_3_TIME_LIMIT);
    setIsGameFinished(false);
    stopTimer();
    startTimer();
  };

  const handleBrickClick = (index: number) => {
    if (revealedBricks[index]) return;

    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });
    setTempRevealedBrick(index);

    if (bricks[index] === currentNumber) {
      setCorrectBrick(index);
      const newRevealedBricks = [...revealedBricks];
      newRevealedBricks[index] = true;
      setRevealedBricks(newRevealedBricks);
      setCurrentNumber(currentNumber + 1);

      if (currentNumber === TOTAL_BRICKS) {
        setShowConfetti(true);
        stopTimer();
        setIsGameFinished(true);
        toast.success(`Félicitations ! ${isLevel3 ? `Vous avez terminé le niveau en ${LEVEL_3_TIME_LIMIT - timeLeft} secondes !` : `Vous avez terminé le jeu en ${timer} secondes !`}`);
      } else {
        toast.success(`Correct ! Trouvez maintenant le numéro ${currentNumber + 1}.`);
      }

      timeoutRef.current = window.setTimeout(() => {
        setFlippedBricks(prev => {
          const newFlipped = [...prev];
          newFlipped[index] = false;
          return newFlipped;
        });
        setTempRevealedBrick(null);
        setCorrectBrick(null);
      }, REVEAL_DURATION);
    } else {
      setErrorBrick(index);
      toast.error("Oups ! Mauvaise brique. Essayez encore.");
      
      if (shouldResetOnError) {
        setRevealedBricks(new Array(TOTAL_BRICKS).fill(false));
        setCurrentNumber(1);
        toast.error("Tout est caché à nouveau ! Recommencez depuis le début.");
      }

      timeoutRef.current = window.setTimeout(() => {
        setErrorBrick(null);
        setFlippedBricks(prev => {
          const newFlipped = [...prev];
          newFlipped[index] = false;
          return newFlipped;
        });
        setTempRevealedBrick(null);
      }, ERROR_DURATION);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold text-white mb-4">Cache Brique</h1>
      <div className="text-6xl font-bold text-white mb-4">
        {isLevel3 ? (
          <>
            <div className="text-2xl mb-2">Temps restant : {timeLeft}s</div>
            <Progress value={(timeLeft / LEVEL_3_TIME_LIMIT) * 100} className="w-64 mb-4" />
          </>
        ) : (
          isGameFinished ? `Temps: ${timer}s` : `Temps: ${timer}s`
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {bricks.map((brick, index) => (
          <motion.div
            key={index}
            className="perspective-1000"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence>
              <motion.div
                className="w-20 h-20 relative"
                initial={false}
                animate={{ 
                  rotateY: flippedBricks[index] ? 180 : 0,
                  backgroundColor: errorBrick === index ? '#ef4444' : correctBrick === index ? '#22c55e' : 'transparent'
                }}
                transition={{ 
                  duration: 0.6,
                  backgroundColor: { duration: 0.3, ease: 'easeOut' }
                }}
              >
                <Button
                  className={`w-full h-full text-2xl font-bold absolute backface-hidden ${
                    revealedBricks[index] ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                  onClick={() => handleBrickClick(index)}
                  disabled={revealedBricks[index]}
                >
                  {revealedBricks[index] || tempRevealedBrick === index ? brick : '?'}
                </Button>
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-bold bg-blue-500 text-white absolute backface-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {brick}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <Button onClick={resetGame}>
          🔄 Recommencer
        </Button>
        <Button 
          onClick={() => navigate('/')}
          variant="secondary"
          className={isGameFinished ? "bg-green-500 hover:bg-green-600 text-white" : ""}
        >
          {isGameFinished ? "➡️ Continuer" : "❌ Abandonner"}
        </Button>
      </div>
    </div>
  );
};

export default CacheBrique;
