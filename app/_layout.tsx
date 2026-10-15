import { useEffect, useState } from 'react';
import { Stack, ThemeProvider } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useUnistyles } from 'react-native-unistyles';
import { LanguageProvider } from '@shared/core/presentation/i18n/useTranslate';
import { DependenciesProvider } from '@shell/presentation/dependencies';
import { useNavigationTheme } from '@shell/presentation/useNavigationTheme';
import { bootApp } from '@shell/app/boot';
import { makeQueryClient, syncQueryFocusWithAppState } from '@shell/app/queryClient';

export default function RootLayout() {
  const [{ dependencies, settings }] = useState(bootApp);
  const [queryClient] = useState(makeQueryClient);
  const navigationTheme = useNavigationTheme();
  const { theme } = useUnistyles();
  useEffect(() => syncQueryFocusWithAppState(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <DependenciesProvider value={dependencies}>
        <LanguageProvider language={settings.language}>
          <ThemeProvider value={navigationTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: true }} />
              <Stack.Screen
                name="gallery"
                options={{
                  presentation: 'fullScreenModal',
                  headerShown: true,
                  headerTransparent: true,
                  headerTintColor: theme.colors.onStage,
                  contentStyle: { backgroundColor: theme.colors.stage },
                }}
              />
            </Stack>
          </ThemeProvider>
        </LanguageProvider>
      </DependenciesProvider>
    </QueryClientProvider>
  );
}
