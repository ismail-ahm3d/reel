import { Appearance, DevSettings, I18nManager } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import type { Language, ThemePreference } from '@features/settings/domain/model/appSettings';
import { isRightToLeft } from '@features/settings/domain/model/appSettings';

/** Paints the app and the native chrome (headers, sheets, keyboard) in the chosen appearance. */
export const applyTheme = (theme: ThemePreference): void => {
  if (theme === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
    Appearance.setColorScheme('unspecified');
    return;
  }
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(theme);
  Appearance.setColorScheme(theme);
};

/** True when the running layout direction already matches the language. */
export const directionMatches = (language: Language): boolean =>
  I18nManager.isRTL === isRightToLeft(language);

/** Sets the layout direction for the next start; React Native reads it only when the app starts. */
export const setDirection = (language: Language): void => {
  const rtl = isRightToLeft(language);
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
};

/**
 * Restarts the JavaScript app so a new language and direction take effect. Development builds can
 * reload themselves; a release build without expo-updates cannot, and the user reopens the app.
 */
export const restartApp = (): boolean => {
  if (!__DEV__) return false;
  DevSettings.reload('language changed');
  return true;
};

/** What the settings screen calls after a language is saved. */
export const applyLanguage = (language: Language): Promise<boolean> => {
  setDirection(language);
  return Promise.resolve(restartApp());
};
