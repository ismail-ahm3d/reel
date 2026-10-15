import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { GallerySource } from '@shared/domain/model/gallerySource';
import type { Gallery } from '@features/gallery/domain/model/gallery';
import type { GalleryRepository } from '@features/gallery/domain/repositories/galleryRepository';

export type GetGallery = (source: GallerySource) => Promise<Outcome<Gallery>>;

export const makeGetGallery =
  ({ gallery }: { gallery: GalleryRepository }): GetGallery =>
  (source) =>
    outcome(() => gallery.images(source));
