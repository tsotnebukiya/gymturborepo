import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './translations/english.json';
import translationEs from './translations/spanish.json';
import translationRu from './translations/russian.json';
import translationFr from './translations/french.json';
import translationDe from './translations/german.json';
import translationIt from './translations/italian.json';
import translationPt from './translations/portuguese.json';
import translationZh from './translations/chinese.json';
import { type PrismaTypes } from '@acme/api';

export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'zh';

type TranslationFileType = typeof translationEn;

export const resources: Record<
  LanguageCode,
  { translation: TranslationFileType }
> = {
  en: { translation: translationEn },
  es: { translation: translationEs },
  fr: { translation: translationFr },
  de: { translation: translationDe },
  it: { translation: translationIt },
  pt: { translation: translationPt },
  ru: { translation: translationRu },
  zh: { translation: translationZh },
};

export const isoPrismaMapping: Record<
  LanguageCode,
  PrismaTypes.$Enums.Language
> = {
  en: 'ENGLISH',
  es: 'SPANISH',
  fr: 'FRENCH',
  de: 'GERMAN',
  it: 'ITALIAN',
  pt: 'PORTUGUESE',
  ru: 'RUSSIAN',
  zh: 'CHINESE',
} as const;

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
  }

  void i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });
};

void initI18n();

export default i18n;

export const changeLanguage = async (lang: LanguageCode) => {
  await AsyncStorage.setItem('language', lang);
  await i18n.changeLanguage(lang);
};

export function useCurrentLanguageEnum(): PrismaTypes.$Enums.Language {
  const { i18n } = useTranslation();
  return isoPrismaMapping[i18n.language as LanguageCode];
}
