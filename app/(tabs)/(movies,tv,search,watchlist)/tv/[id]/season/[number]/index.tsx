import { Stack, useLocalSearchParams } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { SeasonScreen } from '@features/title/presentation/screens/season/SeasonScreen';

export default function SeasonRoute() {
  const { id, number, name } = useLocalSearchParams<{ id: string; number: string; name?: string }>();
  const { title } = useDependencies();
  return (
    <>
      <Stack.Screen options={{ title: name ?? '', headerLargeTitleEnabled: largeTitles }} />
      <SeasonScreen
        showId={Number(id)}
        seasonNumber={Number(number)}
        useCases={title}
        onOpenEpisode={appNavigation.openEpisode}
      />
    </>
  );
}
