import { useContext } from 'react';
import { TranslationContext } from './TranslationContext';
import { TranslationContextProps } from './types';

const useTranslation = (): TranslationContextProps => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export default useTranslation;

