import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface GameGridProps {
  bricks: number[];
  flippedBricks: boolean[];
  revealedBricks: boolean[];
  tempRevealedBrick: number | null;
  errorBrick: number | null;
  correctBrick: number | null;
  onBrickClick: (index: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  bricks,
  flippedBricks,
  revealedBricks,
  tempRevealedBrick,
  errorBrick,
  correctBrick,
  onBrickClick,
}) => {
  return (
    <div className={`grid ${bricks.length === 10 ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
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
                onClick={() => onBrickClick(index)}
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
  );
};