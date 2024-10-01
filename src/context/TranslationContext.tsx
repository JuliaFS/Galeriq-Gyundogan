import React, { createContext, useState, useEffect } from 'react';
import { en } from '../constants/locales/en';
import { bg } from '../constants/locales/bg';
import { TranslationContextProps, TranslationKeys } from './types';

const translations: Record<string, Record<TranslationKeys, string>> = { en, bg };

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const storedLanguage = getCookie('language') || 'en';
    setLanguage(storedLanguage);
  }, []);

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key;
  };

  const switchLanguage = (lng: string): void => {
    setLanguage(lng);
    setCookie('language', lng, 7);
  };

  return (
    <TranslationContext.Provider value={{ t, switchLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
};


