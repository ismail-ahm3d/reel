import { Stack } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { SettingsButton } from '@shell/presentation/SettingsButton';
import { DiscoverHomeScreen } from '@features/discover/presentation/screens/home/DiscoverHomeScreen';

export default function ShowsRoute() {
  const { discover, genres } = useDependencies();
  const t = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'tabs.tv' }), headerLargeTitleEnabled: true }} />
      <SettingsButton />
      <DiscoverHomeScreen
        type="tv"
        useCases={discover}
        genres={genres}
        onOpenMedia={appNavigation.openMedia}
        onOpenCategory={appNavigation.openCategory}
        onBrowse={appNavigation.openGenre}
      />
    </>
  );
}
