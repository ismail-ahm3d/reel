import { Stack, useLocalSearchParams } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import * as WebBrowser from 'expo-web-browser';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { isMediaType } from '@shared/domain/model/media';
import { useDependencies } from '@shell/presentation/dependencies';
import { ReviewsScreen } from '@features/title/presentation/screens/reviews/ReviewsScreen';

export default function ReviewsRoute() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const { title } = useDependencies();
  const t = useTranslate();
  if (!isMediaType(type)) return null;
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'title.reviews' }), headerLargeTitleEnabled: largeTitles }} />
      <ReviewsScreen
        mediaRef={{ type, id: Number(id) }}
        useCases={title}
        onOpenLink={(url) => void WebBrowser.openBrowserAsync(url)}
      />
    </>
  );
}
