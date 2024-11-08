import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');

  const handleLevelClick = (level: number) => {
    navigate(`/level/${level}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Cache Brique</h1>
      <div className="grid grid-cols-3 gap-4 max-w-md w-full">
        {[...Array(9)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handleLevelClick(index + 1)}
            className="w-full h-24 text-2xl font-bold relative"
            disabled={index > 0} // Seul le niveau 1 est disponible pour l'instant
          >
            {index + 1}
            {completedLevels.includes(index + 1) && (
              <Check className="absolute top-2 right-2 h-6 w-6 text-green-500" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Home;