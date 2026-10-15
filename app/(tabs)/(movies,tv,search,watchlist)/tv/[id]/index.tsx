import { Linking } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { TitleDetailsScreen } from '@features/title/presentation/screens/details/TitleDetailsScreen';
import { TitleAccountBar } from '@features/account/presentation/screens/titleBar/TitleAccountBar';

export default function ShowRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title, watchlist, account } = useDependencies();
  return (
    <>
      <Stack.Screen options={{ title: '', headerTransparent: true }} />
      <TitleDetailsScreen
        mediaRef={{ type: 'tv', id: Number(id) }}
        useCases={title}
        watchlist={watchlist}
        onOpenMedia={appNavigation.openMedia}
        onOpenPerson={appNavigation.openPerson}
        onOpenSeason={appNavigation.openSeason}
        onPlayVideo={(url) => void Linking.openURL(url)}
        onOpenLink={(url) => void WebBrowser.openBrowserAsync(url)}
        onOpenCredits={appNavigation.openCredits}
        onOpenCollection={appNavigation.openCollection}
        onOpenReviews={appNavigation.openReviews}
        onOpenGallery={(ref, kind, index) => {
          appNavigation.openGallery({ kind: ref.type, id: ref.id }, kind, index);
        }}
        onBrowse={appNavigation.openBrowseFrom}
        renderAccountBar={(name) => (
          <TitleAccountBar mediaRef={{ type: 'tv', id: Number(id) }} title={name} useCases={account} />
        )}
      />
    </>
  );
}
