import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        variant={i18n.language === 'en' ? 'default' : 'secondary'}
        onClick={() => i18n.changeLanguage('en')}
      >
        🇬🇧 EN
      </Button>
      <Button
        variant={i18n.language === 'fr' ? 'default' : 'secondary'}
        onClick={() => i18n.changeLanguage('fr')}
      >
        🇫🇷 FR
      </Button>
    </div>
  );
};