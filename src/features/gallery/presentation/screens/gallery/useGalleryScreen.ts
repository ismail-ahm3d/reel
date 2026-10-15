import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import { shareLink } from '@shared/core/presentation/feedback/share';
import type { GalleryKind, GallerySource } from '@shared/domain/model/gallerySource';
import type { SizedImage } from '@shared/domain/model/imageSet';
import { availableKinds } from '@features/gallery/domain/model/gallery';
import type { GalleryUseCases } from '@features/gallery/domain/usecases/galleryUseCases';
import { galleryKeys } from '@features/gallery/presentation/queryKeys';

export type GalleryScreenProps = {
  readonly source: GallerySource;
  readonly initialKind: GalleryKind;
  readonly initialIndex: number;
  readonly useCases: GalleryUseCases;
};

export type GalleryView = {
  readonly kinds: readonly GalleryKind[];
  readonly kind: GalleryKind;
  readonly images: readonly SizedImage[];
  /** Which page opens first; it changes only when the kind changes. */
  readonly startIndex: number;
  readonly index: number;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly selectKind: (kind: GalleryKind) => void;
  readonly showPage: (index: number) => void;
  readonly shareCurrent: () => void;
};

export const useGalleryScreen = ({
  source,
  initialKind,
  initialIndex,
  useCases,
}: GalleryScreenProps): GalleryView => {
  const [selected, setSelected] = useState({ kind: initialKind, start: initialIndex });
  const [index, setIndex] = useState(initialIndex);

  const gallery = useQuery({
    queryKey: galleryKeys.images(source),
    queryFn: async () => getOrThrow(await useCases.getGallery(source)),
  });

  const kinds = gallery.data === undefined ? [] : availableKinds(gallery.data);
  // A kind the subject lacks (a person has no backdrops) falls back to the first it has.
  const kind = kinds.includes(selected.kind) ? selected.kind : (kinds[0] ?? selected.kind);
  const images = gallery.data?.[kind] ?? [];

  return {
    kinds,
    kind,
    images,
    startIndex: Math.min(selected.start, Math.max(images.length - 1, 0)),
    index: Math.min(index, Math.max(images.length - 1, 0)),
    isLoading: gallery.isPending,
    error: gallery.error,
    retry: () => void gallery.refetch(),
    selectKind: (next) => {
      selectionFeedback();
      setSelected({ kind: next, start: 0 });
      setIndex(0);
    },
    showPage: setIndex,
    shareCurrent: () => {
      const image = images[index];
      if (image !== undefined) shareLink('', image.image.large);
    },
  };
};
