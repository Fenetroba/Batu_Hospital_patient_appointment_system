import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '../Components/Language/languages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('hospitalLanguage');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (language) => {
    if (languages[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('hospitalLanguage', language);
    }
  };

  // Get translation for a specific key
  const t = (key) => {
    return languages[currentLanguage]?.translations[key] || languages.english.translations[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
