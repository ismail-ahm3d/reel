import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';

export default function TabsLayout() {
  const { theme } = useUnistyles();
  const t = useTranslate();
  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={theme.colors.primary}>
      <NativeTabs.Trigger name="(movies)">
        <NativeTabs.Trigger.Label>{t({ key: 'tabs.movies' })}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'film', selected: 'film.fill' }} md="movie" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(tv)">
        <NativeTabs.Trigger.Label>{t({ key: 'tabs.tv' })}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'tv', selected: 'tv.fill' }} md="tv" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(watchlist)">
        <NativeTabs.Trigger.Label>{t({ key: 'tabs.library' })}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }}
          md="video_library"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" role="search">
        <NativeTabs.Trigger.Label>{t({ key: 'tabs.search' })}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
