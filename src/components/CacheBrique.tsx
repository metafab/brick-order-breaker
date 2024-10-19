import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { shuffle } from 'lodash';

const TOTAL_BRICKS = 10;

const CacheBrique: React.FC = () => {
  const [bricks, setBricks] = useState<number[]>([]);
  const [revealedBricks, setRevealedBricks] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setBricks(shuffle([...Array(TOTAL_BRICKS)].map((_, i) => i + 1)));
    setRevealedBricks(new Array(TOTAL_BRICKS).fill(false));
    setCurrentNumber(1);
  };

  const handleBrickClick = (index: number) => {
    if (bricks[index] === currentNumber) {
      const newRevealedBricks = [...revealedBricks];
      newRevealedBricks[index] = true;
      setRevealedBricks(newRevealedBricks);
      setCurrentNumber(currentNumber + 1);

      if (currentNumber === TOTAL_BRICKS) {
        toast.success("Congratulations! You've won the game!");
      } else {
        toast.success(`Correct! Find number ${currentNumber + 1} now.`);
      }
    } else {
      toast.error("Oops! Wrong brick. Starting over...");
      resetGame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white mb-8">Cache Brique</h1>
      <div className="grid grid-cols-5 gap-4">
        {bricks.map((brick, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`w-20 h-20 text-2xl font-bold ${
                revealedBricks[index] ? 'bg-green-500' : 'bg-gray-700'
              }`}
              onClick={() => handleBrickClick(index)}
            >
              {revealedBricks[index] ? brick : '?'}
            </Button>
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