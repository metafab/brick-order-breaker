import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          title: 'Brick Clicker',
          tagline: 'if you like to click on bricks',
          restart: '🔄 Restart',
          quit: '❌ Quit',
          continue: '➡️ Continue',
          timeLeft: 'Time left: {{time}}s',
          time: 'Time: {{time}}s',
          level: 'Level {{number}}',
          correct: 'Correct! Now find number {{number}}.',
          wrong: 'Oops! Wrong brick. Try again.',
          resetOnError: 'Everything is hidden again! Start over from the beginning.',
          gameOverTime: 'Game Over! Time\'s up!',
          gameOverLives: 'Game Over! No more lives!',
          congratulations: 'Congratulations! {{message}}',
          completedIn: 'You completed the level in {{time}} seconds!'
        }
      },
      fr: {
        translation: {
          title: 'Brick Clicker',
          tagline: 'si vous aimez cliquer sur des briques',
          restart: '🔄 Recommencer',
          quit: '❌ Abandonner',
          continue: '➡️ Continuer',
          timeLeft: 'Temps restant : {{time}}s',
          time: 'Temps: {{time}}s',
          level: 'Niveau {{number}}',
          correct: 'Correct ! Trouvez maintenant le numéro {{number}}.',
          wrong: 'Oups ! Mauvaise brique. Essayez encore.',
          resetOnError: 'Tout est caché à nouveau ! Recommencez depuis le début.',
          gameOverTime: 'Game Over ! Temps écoulé !',
          gameOverLives: 'Game Over ! Plus de vies !',
          congratulations: 'Félicitations ! {{message}}',
          completedIn: 'Vous avez terminé le niveau en {{time}} secondes !'
        }
      }
    }
  });

export default i18n;