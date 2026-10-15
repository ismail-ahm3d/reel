import { createContext, useContext, type ReactNode } from 'react';
import { ar } from '@shared/core/presentation/i18n/ar';
import { en } from '@shared/core/presentation/i18n/en';

/** The languages the app ships. */
export type AppLanguage = 'en' | 'ar';

/** A translation key and its parameters. ErrorText is one. */
export type Translatable = {
  readonly key: string;
  readonly params?: Readonly<Record<string, string | number>>;
};

export type Translate = (text: Translatable) => string;

const dictionaries: Readonly<Record<AppLanguage, Readonly<Record<string, string>>>> = { en, ar };

const lookup = (
  dictionary: Readonly<Record<string, string>>,
  key: string,
  count: unknown,
): string | undefined => (count === 1 ? dictionary[`${key}_one`] : undefined) ?? dictionary[key];

/** Builds the translate function of one language; a key missing there falls back to English. */
export const makeTranslate =
  (language: AppLanguage): Translate =>
  ({ key, params }) => {
    const template = lookup(dictionaries[language], key, params?.count) ?? lookup(en, key, params?.count);
    if (template === undefined) {
      if (__DEV__) console.warn(`Missing translation: ${key}`);
      return key;
    }
    return params === undefined
      ? template
      : template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => String(params[name] ?? match));
  };

const LanguageContext = createContext<AppLanguage>('en');

/** The shell provides the chosen language once, at the root. */
export const LanguageProvider = ({ language, children }: { language: AppLanguage; children: ReactNode }) => (
  <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
);

/**
 * The translation adapter. The dictionaries are plain objects; a translation library would replace
 * this one file.
 */
export const useTranslate = (): Translate => makeTranslate(useContext(LanguageContext));

/**
 * The locale dates and numbers are written in: Arabic with Latin digits (scores and years read
 * the same as TMDB shows them), or the device's own for English so its date order is kept.
 */
export const useLocale = (): string | undefined =>
  useContext(LanguageContext) === 'ar' ? 'ar-u-nu-latn' : undefined;
