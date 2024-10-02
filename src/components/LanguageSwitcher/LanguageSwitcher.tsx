import React from 'react';
import  useTranslation  from '../../context/useTranslation';
const LanguageSwitcher: React.FC = () => {
  const { switchLanguage, language } = useTranslation();

  return (
    <div>
      <button
        onClick={() => switchLanguage('en')}
        disabled={language === 'en'}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('fr')}
        disabled={language === 'fr'}
      >
        Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;
