import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type {
  AppTheme,
  AppThemes,
  BaseTypography,
  TextToken,
} from '@shared/core/presentation/theme/contract';

/** The platform's own face: San Francisco on iOS, Roboto on Android. */
const fontFamily = Platform.select({ ios: 'System', default: 'sans-serif' });

const text = (
  fontSize: number,
  lineHeight: number,
  fontWeight: TextToken['fontWeight'] = '400',
  letterSpacing = 0,
): TextToken => ({
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
});

/** Follows Apple's Dynamic Type defaults: large title 34, title 28/22, headline 17, body 17, footnote 13. */
const typography: BaseTypography = {
  display: { large: text(34, 41, '700', 0.4), medium: text(28, 34, '700', 0.36), small: text(24, 30, '700') },
  headline: {
    large: text(22, 28, '700', -0.26),
    medium: text(20, 25, '600', -0.45),
    small: text(17, 22, '600', -0.43),
  },
  title: {
    large: text(17, 22, '600', -0.43),
    medium: text(15, 20, '600', -0.23),
    small: text(13, 18, '600', -0.08),
  },
  body: {
    large: text(17, 22, '400', -0.43),
    medium: text(15, 20, '400', -0.23),
    small: text(13, 18, '400', -0.08),
  },
  label: { large: text(13, 18, '500', -0.08), medium: text(12, 16, '500'), small: text(11, 13, '600', 0.06) },
};

const shared = {
  typography,
  spacing: { none: 0, xxs: 2, xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 32, xxxl: 48 },
  shape: { none: 0, xs: 4, s: 8, m: 10, l: 14, xl: 20, xxl: 28, full: 9999 },
  border: { none: 0, hairline: StyleSheet.hairlineWidth, thin: 1, medium: 2, thick: 3, heavy: 4 },
  iconSize: { s: 14, m: 20, l: 28, xl: 56 },
} satisfies Omit<AppTheme, 'colors'>;

/** iOS system colours, so the app sits next to the system chrome without a seam. */
const light: AppTheme = {
  ...shared,
  colors: {
    primary: '#FF2D55',
    onPrimary: '#FFFFFF',
    secondary: '#E5E5EA',
    onSecondary: '#000000',
    tertiary: '#5856D6',
    onTertiary: '#FFFFFF',
    neutral: '#8E8E93',
    onNeutral: '#FFFFFF',
    error: '#FF3B30',
    onError: '#FFFFFF',
    success: '#34C759',
    onSuccess: '#FFFFFF',
    warning: '#FF9500',
    onWarning: '#FFFFFF',
    background: '#FFFFFF',
    onBackground: '#000000',
    surface: '#F2F2F7',
    onSurface: '#000000',
    surfaceVariant: '#E5E5EA',
    onSurfaceVariant: '#6C6C70',
    scrim: 'rgba(0, 0, 0, 0.72)',
    onScrim: '#FFFFFF',
    stage: '#000000',
    onStage: '#FFFFFF',
    outline: '#C6C6C8',
  },
};

const dark: AppTheme = {
  ...shared,
  colors: {
    ...light.colors,
    primary: '#FF375F',
    secondary: '#2C2C2E',
    onSecondary: '#FFFFFF',
    tertiary: '#5E5CE6',
    neutral: '#8E8E93',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    background: '#000000',
    onBackground: '#FFFFFF',
    surface: '#1C1C1E',
    onSurface: '#FFFFFF',
    surfaceVariant: '#2C2C2E',
    onSurfaceVariant: '#98989F',
    scrim: 'rgba(0, 0, 0, 0.78)',
    outline: '#38383A',
  },
};

export const standardThemes: AppThemes = { light, dark };
