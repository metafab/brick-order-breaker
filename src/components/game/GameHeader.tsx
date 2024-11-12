import { Progress } from "@/components/ui/progress";

interface GameHeaderProps {
  timer: number;
  timeLeft?: number;
  totalTime?: number;
  lives?: number;
  maxLives?: number;
  isLevel3?: boolean;
  isLevel5?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  timer, 
  timeLeft, 
  totalTime, 
  lives, 
  maxLives,
  isLevel3,
  isLevel5
}) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Cache Brique</h1>
      <div className="text-6xl font-bold text-white mb-4">
        {isLevel3 ? (
          <>
            <div className="text-2xl mb-2">Temps restant : {timeLeft}s</div>
            <Progress value={(timeLeft! / totalTime!) * 100} className="w-64 mb-4" />
          </>
        ) : (
          <>
            {isLevel5 && (
              <div className="flex gap-2 mb-4 justify-center">
                {[...Array(maxLives)].map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < lives! ? "❤️" : "🖤"}
                  </span>
                ))}
              </div>
            )}
            <div className="text-2xl">Temps: {timer}s</div>
          </>
        )}
      </div>
    </>
  );
};