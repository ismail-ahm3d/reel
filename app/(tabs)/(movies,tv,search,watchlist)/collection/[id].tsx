import { Stack, useLocalSearchParams } from 'expo-router';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { CollectionScreen } from '@features/title/presentation/screens/collection/CollectionScreen';

export default function CollectionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title, watchlist } = useDependencies();
  return (
    <>
      <Stack.Screen options={{ title: '', headerTransparent: true }} />
      <CollectionScreen
        collectionId={Number(id)}
        useCases={title}
        watchlist={watchlist}
        onOpenMedia={appNavigation.openMedia}
      />
    </>
  );
}
