import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { PersonScreen } from '@features/people/presentation/screens/person/PersonScreen';

export default function PersonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { people } = useDependencies();
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <PersonScreen
        personId={Number(id)}
        useCases={people}
        onOpenMedia={appNavigation.openMedia}
        onOpenGallery={(source, index) => {
          appNavigation.openGallery(source, 'profiles', index);
        }}
        onOpenLink={(url) => void WebBrowser.openBrowserAsync(url)}
      />
    </>
  );
}
