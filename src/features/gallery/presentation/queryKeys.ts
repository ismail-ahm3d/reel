import type { GallerySource } from '@shared/domain/model/gallerySource';

/** Every query key of the feature, built here and nowhere else. */
export const galleryKeys = {
  all: ['gallery'] as const,
  images: (source: GallerySource) => ['gallery', 'images', source] as const,
};
