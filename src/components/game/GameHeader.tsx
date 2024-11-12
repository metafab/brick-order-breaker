import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
      <div className="text-6xl font-bold text-white mb-4 flex flex-col items-center">
        {isLevel3 ? (
          <>
            <div className="text-2xl mb-2">{t('timeLeft', { time: timeLeft })}</div>
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
            <div className="text-2xl text-center">{t('time', { time: timer })}</div>
          </>
        )}
      </div>
    </>
  );
};