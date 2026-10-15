import type { GallerySource } from '@shared/domain/model/gallerySource';
import type { Gallery } from '@features/gallery/domain/model/gallery';

/** Every function may throw AppError; nothing else. */
export type GalleryRepository = {
  readonly images: (source: GallerySource) => Promise<Gallery>;
};
