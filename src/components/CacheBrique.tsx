import React from 'react';
import { Button } from "@/components/ui/button";
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import { GameHeader } from './game/GameHeader';
import { GameGrid } from './game/GameGrid';
import { useGameLogic } from '@/hooks/useGameLogic';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LEVEL_3_TIME_LIMIT = 30;
const LEVEL_5_MAX_LIVES = 10;

const CacheBrique: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { levelId } = useParams();
  const isLevel3 = levelId === "3";
  const isLevel4 = levelId === "4";
  const isLevel5 = levelId === "5";
  const totalBricks = isLevel4 ? 8 : 6;

  const {
    bricks,
    revealedBricks,
    flippedBricks,
    tempRevealedBrick,
    showConfetti,
    errorBrick,
    correctBrick,
    timer,
    timeLeft,
    lives,
    isGameFinished,
    isGameLost,
    handleBrickClick,
    resetGame
  } = useGameLogic(levelId, totalBricks);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <LanguageSwitcher />
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
      <h2 className="text-2xl text-white mb-4">{t('level', { number: levelId })}</h2>
      <GameHeader 
        timer={timer}
        timeLeft={timeLeft}
        totalTime={LEVEL_3_TIME_LIMIT}
        lives={lives}
        maxLives={LEVEL_5_MAX_LIVES}
        isLevel3={isLevel3}
        isLevel5={isLevel5}
      />
      <GameGrid 
        bricks={bricks}
        flippedBricks={flippedBricks}
        revealedBricks={revealedBricks}
        tempRevealedBrick={tempRevealedBrick}
        errorBrick={errorBrick}
        correctBrick={correctBrick}
        onBrickClick={handleBrickClick}
        levelId={levelId}
      />
      <div className="flex gap-4 mt-8">
        <Button onClick={resetGame}>
          {t('restart')}
        </Button>
        <Button 
          onClick={() => navigate('/')}
          variant="secondary"
          className={isGameFinished && !isGameLost ? "bg-green-500 hover:bg-green-600 text-white" : ""}
        >
          {isGameFinished && !isGameLost ? t('continue') : t('quit')}
        </Button>
      </div>
    </div>
  );
};

export default CacheBrique;