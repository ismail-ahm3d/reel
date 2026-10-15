import { Stack } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { SettingsButton } from '@shell/presentation/SettingsButton';
import { LibraryScreen } from '@features/account/presentation/screens/library/LibraryScreen';

export default function LibraryRoute() {
  const { watchlist, account } = useDependencies();
  const t = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'tabs.library' }), headerLargeTitleEnabled: largeTitles }} />
      <SettingsButton />
      <LibraryScreen
        account={account}
        watchlist={watchlist}
        onOpenMedia={appNavigation.openMedia}
        onOpenList={appNavigation.openList}
      />
    </>
  );
}
