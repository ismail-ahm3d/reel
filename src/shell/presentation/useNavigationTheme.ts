import { DarkTheme, DefaultTheme } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

/**
 * React Navigation's theme from the app's tokens, so native headers and tab bars match the screens.
 * It follows the applied theme, which differs from the system's when the user picked one.
 */
export const useNavigationTheme = () => {
  const { theme, rt } = useUnistyles();
  const base = rt.themeName === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.onBackground,
      border: theme.colors.outline,
    },
  };
};
