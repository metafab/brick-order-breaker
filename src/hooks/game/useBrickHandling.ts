import { useRef } from 'react';
import { toast } from "sonner";
import { evaluateMathExpression, parseTimeToMinutes } from '@/utils/levelUtils';

const REVEAL_DURATION = 2000;
const ERROR_DURATION = 1000;

export const useBrickHandling = (
  levelId: string | undefined,
  bricks: (number | string)[],
  revealedBricks: boolean[],
  setRevealedBricks: (bricks: boolean[]) => void,
  setFlippedBricks: (fn: (prev: boolean[]) => boolean[]) => void,
  currentNumber: number,
  setCurrentNumber: (num: number) => void,
  setTempRevealedBrick: (index: number | null) => void,
  setErrorBrick: (index: number | null) => void,
  setCorrectBrick: (index: number | null) => void,
  setStreak: (fn: (prev: number) => number) => void,
  handleGameComplete: () => void,
  lives: number,
  setLives: (lives: number) => void,
  handleGameOver: (message: string) => void,
) => {
  const timeoutRef = useRef<number | null>(null);

  const getBrickValue = (brick: number | string): number => {
    if (levelId === "9") return evaluateMathExpression(brick.toString());
    if (levelId === "10") return parseTimeToMinutes(brick.toString());
    return Number(brick);
  };

  const getNextExpectedNumber = () => {
    const remainingValues = bricks
      .map((brick, index) => ({ value: getBrickValue(brick), index }))
      .filter((_, index) => !revealedBricks[index])
      .sort((a, b) => a.value - b.value);
    
    return remainingValues[0]?.value;
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

  const handleBrickClick = (index: number) => {
    const shouldResetOnError = ["2", "3", "4", "5", "8", "9", "10", "11"].includes(levelId || "");
    const clickedValue = getBrickValue(bricks[index]);
    const expectedValue = getNextExpectedNumber();

    setFlippedBricks(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });
    setTempRevealedBrick(index);

    if (clickedValue === expectedValue) {
      setCorrectBrick(index);
      setStreak(prev => prev + 1);
      const newRevealedBricks = [...revealedBricks];
      newRevealedBricks[index] = true;
      setRevealedBricks(newRevealedBricks);

      // Check if all bricks are revealed after this correct click
      const allRevealed = newRevealedBricks.every(brick => brick);
      if (allRevealed) {
        handleGameComplete();
      } else {
        const nextNumber = getNextExpectedNumber();
        if (nextNumber) {
          setCurrentNumber(nextNumber);
        }
      }

      timeoutRef.current = window.setTimeout(() => {
        resetBrickState(index);
      }, REVEAL_DURATION);
    } else {
      setErrorBrick(index);
      setStreak(0);
      toast.error("Wrong brick!");
      
      if (levelId === "5") {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives === 0) {
          handleGameOver("No more lives!");
          return;
        }
      }

      if (shouldResetOnError) {
        setRevealedBricks(new Array(bricks.length).fill(false));
        const firstNumber = Math.min(...bricks.map(getBrickValue));
        setCurrentNumber(firstNumber);
      }

      timeoutRef.current = window.setTimeout(() => {
        resetBrickState(index);
      }, ERROR_DURATION);
    }
  };

  return { handleBrickClick, timeoutRef };
};