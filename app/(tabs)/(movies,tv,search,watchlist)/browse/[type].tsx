import { Stack, useLocalSearchParams } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { isBrowseSourceKind, type BrowseSource } from '@shared/domain/model/browseSource';
import { isMediaType } from '@shared/domain/model/media';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { BrowseScreen } from '@features/discover/presentation/screens/browse/BrowseScreen';

export default function BrowseRoute() {
  const { type, source, sourceId, title } = useLocalSearchParams<{
    type: string;
    source?: string;
    sourceId?: string;
    title?: string;
  }>();
  const { discover, genres } = useDependencies();
  const t = useTranslate();
  if (!isMediaType(type)) return null;
  const id = Number(sourceId);
  const from: BrowseSource | null =
    source !== undefined && isBrowseSourceKind(source) && Number.isFinite(id)
      ? { kind: source, id, name: title ?? '' }
      : null;
  return (
    <>
      <Stack.Screen
        options={{
          title: title ?? t({ key: type === 'movie' ? 'discover.allMovies' : 'discover.allTv' }),
          headerLargeTitleEnabled: largeTitles,
        }}
      />
      <BrowseScreen
        type={type}
        source={from}
        useCases={discover}
        genres={genres}
        onOpenMedia={appNavigation.openMedia}
      />
    </>
  );
}
