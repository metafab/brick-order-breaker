import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toRomanNumeral } from "@/utils/romanNumerals";

interface GameGridProps {
  bricks: number[];
  flippedBricks: boolean[];
  revealedBricks: boolean[];
  tempRevealedBrick: number | null;
  errorBrick: number | null;
  correctBrick: number | null;
  onBrickClick: (index: number) => void;
  levelId?: string;
  streak?: number;
}

export const GameGrid: React.FC<GameGridProps> = ({
  bricks,
  flippedBricks,
  revealedBricks,
  tempRevealedBrick,
  errorBrick,
  correctBrick,
  onBrickClick,
  levelId,
  streak = 0,
}) => {
  const isRomanLevel = levelId === "6";
  const isFoxLevel = levelId === "8";
  
  const displayNumber = (num: number) => {
    if (isRomanLevel) return toRomanNumeral(num);
    if (isFoxLevel) return Array(num).fill("🦊").map((fox, i) => <span key={i} className="mx-0.5">{fox}</span>);
    return num;
  };

  return (
    <div className="relative">
      {streak > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-white font-bold"
        >
          <span className="text-xl bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
            🔥 {streak} Streak!
          </span>
        </motion.div>
      )}
      <div className={`grid ${bricks.length === 8 ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
        {bricks.map((brick, index) => (
          <motion.div
            key={index}
            className="perspective-1000"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence>
              <motion.div
                className="w-24 h-24 relative"
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
                  } ${isFoxLevel ? 'text-lg flex-wrap break-words overflow-hidden' : ''}`}
                  onClick={() => onBrickClick(index)}
                  disabled={revealedBricks[index]}
                >
                  <div className="flex items-center justify-center flex-wrap">
                    {revealedBricks[index] || tempRevealedBrick === index ? displayNumber(brick) : '?'}
                  </div>
                </Button>
                <div
                  className={`w-full h-full flex items-center justify-center text-2xl font-bold bg-blue-500 text-white absolute backface-hidden ${isFoxLevel ? 'text-lg flex-wrap break-words overflow-hidden' : ''}`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="flex items-center justify-center flex-wrap">
                    {displayNumber(brick)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};