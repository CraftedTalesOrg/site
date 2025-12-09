import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';

export const defaultNS = 'translations';
export const resources = {
  en,
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS,
    debug: false,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
