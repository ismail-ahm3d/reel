import { Stack, useLocalSearchParams } from 'expo-router';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { EpisodeScreen } from '@features/title/presentation/screens/episode/EpisodeScreen';

export default function EpisodeRoute() {
  const { id, number, episode } = useLocalSearchParams<{ id: string; number: string; episode: string }>();
  const { title } = useDependencies();
  return (
    <>
      <Stack.Screen options={{ title: '', headerTransparent: true }} />
      <EpisodeScreen
        showId={Number(id)}
        seasonNumber={Number(number)}
        episodeNumber={Number(episode)}
        useCases={title}
        onOpenPerson={appNavigation.openPerson}
        onOpenGallery={(source, index) => {
          appNavigation.openGallery(source, 'stills', index);
        }}
      />
    </>
  );
}
