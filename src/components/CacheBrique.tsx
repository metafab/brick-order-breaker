import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { shuffle } from 'lodash';
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom';

const TOTAL_BRICKS = 6;
const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;

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
  const [isGameFinished, setIsGameFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (currentNumber === 1 && !isGameFinished) {
      startTimer();
    }
    if (currentNumber > TOTAL_BRICKS) {
      stopTimer();
      setIsGameFinished(true);
      const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
      if (levelId && !completedLevels.includes(Number(levelId))) {
        completedLevels.push(Number(levelId));
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      }
    }
  }, [currentNumber, isGameFinished, levelId]);

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
      // Marquer immédiatement la brique comme trouvée
      const newRevealedBricks = [...revealedBricks];
      newRevealedBricks[index] = true;
      setRevealedBricks(newRevealedBricks);
      setCurrentNumber(currentNumber + 1);

      if (currentNumber === TOTAL_BRICKS) {
        setShowConfetti(true);
        stopTimer();
        setIsGameFinished(true);
        toast.success(`Félicitations ! Vous avez terminé le jeu en ${timer} secondes !`);
      } else {
        toast.success(`Correct ! Trouvez maintenant le numéro ${currentNumber + 1}.`);
      }

      // Gérer l'animation de retour
      setTimeout(() => {
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
      setTimeout(() => {
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
      <div className="text-6xl font-bold text-white mb-8">
        {isGameFinished ? `Temps: ${timer}s` : `Temps: ${timer}s`}
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
          Recommencer
        </Button>
        <Button 
          onClick={() => navigate('/')}
          variant="secondary"
        >
          {isGameFinished ? "Continuer" : "Abandonner"}
        </Button>
      </div>
    </div>
  );
};

export default CacheBrique;