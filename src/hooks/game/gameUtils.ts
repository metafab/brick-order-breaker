export const generateRandomNumbers = (totalBricks: number) => {
  const numbers = [];
  for (let i = 0; i < totalBricks; i++) {
    numbers.push(Math.floor(Math.random() * 100) + 1);
  }
  return numbers.sort((a, b) => a - b);
};

export const getNextExpectedNumber = (bricks: number[], currentNumber: number) => {
  const sortedBricks = [...bricks].sort((a, b) => a - b);
  const currentIndex = sortedBricks.indexOf(currentNumber);
  return currentIndex < sortedBricks.length - 1 ? sortedBricks[currentIndex + 1] : null;
};