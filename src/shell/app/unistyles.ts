import { StyleSheet } from 'react-native-unistyles';
import type { AppThemes } from '@shared/core/presentation/theme/contract';
import { standardThemes } from '@shell/app/theme/standard';

/** One entry per build variant; EXPO_PUBLIC_APP_VARIANT is set by the build profile. */
const variants: Readonly<Record<string, AppThemes>> = { standard: standardThemes };
const themes = variants[process.env.EXPO_PUBLIC_APP_VARIANT ?? 'standard'] ?? standardThemes;

type RegisteredThemes = { light: AppThemes['light']; dark: AppThemes['dark'] };

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends RegisteredThemes {}
}

StyleSheet.configure({
  themes: { light: themes.light, dark: themes.dark },
  settings: { adaptiveThemes: true },
});
