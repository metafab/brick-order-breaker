import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en'; // Fallback to 'en' if language is undefined

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'secondary'}
        onClick={() => i18n.changeLanguage('en')}
      >
        🇬🇧 EN
      </Button>
      <Button
        variant={currentLanguage === 'fr' ? 'default' : 'secondary'}
        onClick={() => i18n.changeLanguage('fr')}
      >
        🇫🇷 FR
      </Button>
    </div>
  );
};