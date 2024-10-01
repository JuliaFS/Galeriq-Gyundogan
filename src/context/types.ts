//import { bg } from "../bg";
import { en } from "../constants/locales/en";

export type TranslationKeys = keyof typeof en; // Union type of keys from 'en' translation object
//export type TranslationKeys = keyof typeof bg; // Union type of keys from 'en' translation object

export interface TranslationContextProps {
    t: (key: TranslationKeys) => string;
    switchLanguage: (lng: string) => void;
    language: string;
  }