import type { GetGallery } from '@features/gallery/domain/usecases/getGallery';

export type GalleryUseCases = {
  readonly getGallery: GetGallery;
};
