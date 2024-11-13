import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
  const levelTimes = JSON.parse(localStorage.getItem('levelTimes') || '{}');

  const handleLevelClick = (level: number) => {
    if (level === 5) {
      const previousLevelsCompleted = [1, 2, 3, 4].every(l => completedLevels.includes(l));
      if (!previousLevelsCompleted) {
        return;
      }
    }
    navigate(`/level/${level}`);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const isLevelAccessible = (level: number) => {
    if (level <= 4) return true;
    if (level === 5) {
      return [1, 2, 3, 4].every(l => completedLevels.includes(l));
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
      <p className="text-xl text-white mb-8 italic">{t('tagline')}</p>
      <div className="grid grid-cols-3 gap-4 max-w-md w-full">
        {[...Array(9)].map((_, index) => {
          const level = index + 1;
          return (
            <div key={index} className="flex flex-col items-center">
              <Button
                onClick={() => handleLevelClick(level)}
                className={`w-full h-24 text-2xl font-bold relative mb-1 ${
                  !isLevelAccessible(level) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isLevelAccessible(level)}
              >
                {level}
                {completedLevels.includes(level) && (
                  <Check className="absolute top-2 right-2 h-6 w-6 text-green-500" />
                )}
              </Button>
              {completedLevels.includes(level) && levelTimes[level] && (
                <span className="text-sm text-white">
                  {formatTime(levelTimes[level])}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;