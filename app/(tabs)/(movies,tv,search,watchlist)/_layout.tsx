import { Platform } from 'react-native';
import { Stack } from 'expo-router';

/** Each tab gets its own native stack; the anchor is the screen it opens on. */
export const unstable_settings = {
  anchor: 'index',
  movies: { anchor: 'index' },
  tv: { anchor: 'shows' },
  search: { anchor: 'search' },
  watchlist: { anchor: 'watchlist' },
};

/** iOS 26 draws the bar in Liquid Glass over the content; earlier versions need a blur behind it. */
const isLiquidGlass = Platform.OS === 'ios' && Number.parseInt(Platform.Version, 10) >= 26;

export default function TabStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: Platform.OS === 'ios',
        ...(Platform.OS === 'ios' && !isLiquidGlass
          ? { headerBlurEffect: 'systemChromeMaterial' as const }
          : {}),
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  );
}
