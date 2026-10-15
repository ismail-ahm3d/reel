import { Stack } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { SettingsButton } from '@shell/presentation/SettingsButton';
import { useAutoplayFeatured } from '@shell/presentation/useAutoplayFeatured';
import { DiscoverHomeScreen } from '@features/discover/presentation/screens/home/DiscoverHomeScreen';

export default function ShowsRoute() {
  const { discover, genres } = useDependencies();
  const t = useTranslate();
  const autoplayFeatured = useAutoplayFeatured();
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'tabs.tv' }), headerLargeTitleEnabled: largeTitles }} />
      <SettingsButton />
      <DiscoverHomeScreen
        type="tv"
        useCases={discover}
        genres={genres}
        onOpenMedia={appNavigation.openMedia}
        onOpenCategory={appNavigation.openCategory}
        onBrowse={appNavigation.openGenre}
        autoplayFeatured={autoplayFeatured}
      />
    </>
  );
}
