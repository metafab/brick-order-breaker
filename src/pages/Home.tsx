import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface LevelCompletion {
  completed: boolean;
  time: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
  const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');

  const handleLevelClick = (level: number) => {
    navigate(`/level/${level}`);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const isLevelAccessible = (level: number) => {
    // Levels 1-3 are always accessible
    if (level <= 3) return true;
    
    // For levels 4 and above, check if all previous levels are completed
    for (let i = 1; i < level; i++) {
      if (!completedLevels.includes(i)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
      <p className="text-xl text-white mb-8 italic">{t('tagline')}</p>
      <div className="grid grid-cols-3 gap-4 max-w-md w-full">
        {[...Array(11)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Button
              onClick={() => handleLevelClick(index + 1)}
              className="w-full h-24 text-2xl font-bold relative mb-1"
              disabled={!isLevelAccessible(index + 1)}
            >
              {index + 1}
              {completedLevels.includes(index + 1) && (
                <Check className="absolute top-2 right-2 h-6 w-6 text-green-500" />
              )}
            </Button>
            {completedLevels.includes(index + 1) && levelTimes[index + 1] && (
              <span className="text-sm text-white">
                {formatTime(levelTimes[index + 1])}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;