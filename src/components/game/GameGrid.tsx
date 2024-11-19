import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toRomanNumeral } from "@/utils/romanNumerals";
import { evaluateMathExpression, parseTimeToMinutes } from "@/utils/levelUtils";

interface GameGridProps {
  bricks: number[] | string[];
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
  const isMathLevel = levelId === "9";
  const isTimeLevel = levelId === "10";
  const isMixedLevel = levelId === "11";
  
  const displayValue = (value: string | number) => {
    if (isMathLevel) return value;
    if (isTimeLevel) return value;
    if (isMixedLevel && typeof value === 'string') return value;
    
    const num = Number(value);
    if (isRomanLevel) return toRomanNumeral(num);
    if (isFoxLevel) return Array(num).fill("🦊").map((fox, i) => (
      <span key={i} className="mx-0.5">{fox}</span>
    ));
    return value;
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
                  } ${isFoxLevel || isMixedLevel ? 'text-lg flex-wrap break-words overflow-hidden' : ''}`}
                  onClick={() => onBrickClick(index)}
                  disabled={revealedBricks[index]}
                >
                  <div className="flex items-center justify-center flex-wrap">
                    {revealedBricks[index] || tempRevealedBrick === index ? displayValue(brick) : '?'}
                  </div>
                </Button>
                <div
                  className={`w-full h-full flex items-center justify-center text-2xl font-bold bg-blue-500 text-white absolute backface-hidden ${isFoxLevel || isMixedLevel ? 'text-lg flex-wrap break-words overflow-hidden' : ''}`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="flex items-center justify-center flex-wrap">
                    {displayValue(brick)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      {streak > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-white font-bold mt-4"
        >
          <span className="text-xl bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
            🔥 {streak} Streak!
          </span>
        </motion.div>
      )}
    </div>
  );
};