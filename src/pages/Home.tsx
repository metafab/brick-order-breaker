import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
  const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');

  const handleLevelClick = (level: number) => {
    navigate(`/level/${level}`);
  };

  const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return '';
    return `${seconds}s`;
  };

  const isLevelAccessible = (level: number) => {
    if (level === 1) return true;
    return completedLevels.includes(level - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="relative">
            <Button
              onClick={() => handleLevelClick(index + 1)}
              className="w-full h-24 text-2xl font-bold relative mb-1"
              disabled={!isLevelAccessible(index + 1)}
            >
              {index + 1}
              {completedLevels.includes(index + 1) && (
                <Check className="absolute top-2 right-2 text-green-500" />
              )}
            </Button>
            {completedLevels.includes(index + 1) && (
              <div className="text-white text-sm">
                {t('time')}: {formatTime(levelTimes[index + 1])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;