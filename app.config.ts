import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Reel',
  slug: 'tmdb-sandbox',
  scheme: 'reel',
  version: '0.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.revge.reel',
    appleTeamId: 'G4L383Q8HV',
  },
  android: {
    package: 'com.revge.reel',
    adaptiveIcon: {
      backgroundColor: '#000000',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  plugins: [
    'expo-router',
    'expo-image',
    ['expo-localization', { supportedLocales: { ios: ['en', 'ar'], android: ['en', 'ar'] } }],
    'expo-sqlite',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 120,
        backgroundColor: '#FFFFFF',
        dark: { backgroundColor: '#000000' },
      },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
