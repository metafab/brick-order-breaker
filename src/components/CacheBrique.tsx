import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { shuffle } from 'lodash';
import Confetti from 'react-confetti';

const TOTAL_BRICKS = 6; // Reduced from 10 to 6
const REVEAL_DURATION = 2000; // 2 seconds

const CacheBrique: React.FC = () => {
  const [bricks, setBricks] = useState<number[]>([]);
  const [revealedBricks, setRevealedBricks] = useState<boolean[]>([]);
  const [flippedBricks, setFlippedBricks] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tempRevealedBrick, setTempRevealedBrick] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setBricks(shuffle([...Array(TOTAL_BRICKS)].map((_, i) => i + 1)));
    setRevealedBricks(new Array(TOTAL_BRICKS).fill(false));
    setFlippedBricks(new Array(TOTAL_BRICKS).fill(false));
    setCurrentNumber(1);
    setIsProcessing(false);
    setTempRevealedBrick(null);
    setShowConfetti(false);
  };

  const handleBrickClick = async (index: number) => {
    if (isProcessing || revealedBricks[index]) return;

    setIsProcessing(true);
    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });
    setTempRevealedBrick(index);

    await new Promise(resolve => setTimeout(resolve, REVEAL_DURATION));

    if (bricks[index] === currentNumber) {
      const newRevealedBricks = [...revealedBricks];
      newRevealedBricks[index] = true;
      setRevealedBricks(newRevealedBricks);
      setCurrentNumber(currentNumber + 1);

      if (currentNumber === TOTAL_BRICKS) {
        setShowConfetti(true);
        toast.success("Congratulations! You've won the game!");
      } else {
        toast.success(`Correct! Find number ${currentNumber + 1} now.`);
      }
    } else {
      toast.error("Oops! Wrong brick. Try again.");
    }

    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = false;
      return newFlipped;
    });
    setTempRevealedBrick(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold text-white mb-8">Cache Brique</h1>
      <div className="grid grid-cols-3 gap-4"> {/* Changed from grid-cols-5 to grid-cols-3 */}
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
                animate={{ rotateY: flippedBricks[index] ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  className={`w-full h-full text-2xl font-bold absolute backface-hidden ${
                    revealedBricks[index] ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                  onClick={() => handleBrickClick(index)}
                  disabled={isProcessing || revealedBricks[index]}
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
      <Button className="mt-8" onClick={resetGame}>
        Reset Game
      </Button>
    </div>
  );
};

export default CacheBrique;