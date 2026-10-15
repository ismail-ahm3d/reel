import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import type { GalleryKind, GallerySource } from '@shared/domain/model/gallerySource';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { GalleryScreen } from '@features/gallery/presentation/screens/gallery/GalleryScreen';

const kinds: readonly GalleryKind[] = ['backdrops', 'posters', 'profiles', 'stills'];

/** Turns the params back into a source; anything malformed has no gallery. */
const toSource = (params: Readonly<Record<string, string | undefined>>): GallerySource | null => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return null;
  switch (params.source) {
    case 'movie':
    case 'tv':
    case 'person':
      return { kind: params.source, id };
    case 'episode':
      return { kind: 'episode', id, season: Number(params.season), episode: Number(params.episode) };
    default:
      return null;
  }
};

export default function GalleryRoute() {
  const params = useLocalSearchParams<{
    source: string;
    id: string;
    season?: string;
    episode?: string;
    kind: string;
    index: string;
  }>();
  const { gallery } = useDependencies();
  const t = useTranslate();
  const source = toSource(params);
  const kind = kinds.find((value) => value === params.kind) ?? 'backdrops';
  if (source === null) return null;
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button variant="done" onPress={appNavigation.closeModal}>
          {t({ key: 'common.done' })}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <GalleryScreen
        source={source}
        initialKind={kind}
        initialIndex={Number(params.index) || 0}
        useCases={gallery}
      />
    </>
  );
}
