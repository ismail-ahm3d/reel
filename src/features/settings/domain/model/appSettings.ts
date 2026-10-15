export type Language = 'en' | 'ar';

export const languages: readonly Language[] = ['en', 'ar'];

export type ThemePreference = 'system' | 'light' | 'dark';

export const themePreferences: readonly ThemePreference[] = ['system', 'light', 'dark'];

export type AppSettings = {
  readonly language: Language;
  readonly theme: ThemePreference;
};

/** Arabic reads right to left; the layout follows. */
export const isRightToLeft = (language: Language): boolean => language === 'ar';

/** First launch follows the device: Arabic if it prefers Arabic, English otherwise, system appearance. */
export const defaultSettings = (deviceLanguageCode: string): AppSettings => ({
  language: deviceLanguageCode === 'ar' ? 'ar' : 'en',
  theme: 'system',
});
