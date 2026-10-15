import { toSizedImages } from '@shared/data/mappers/tmdbMappers';
import type { ImageDto } from '@shared/data/datasources/remote/tmdbDto';
import type { GalleryRepository } from '@features/gallery/domain/repositories/galleryRepository';
import type { GalleryRemoteDataSource } from '@features/gallery/data/datasources/remote/galleryRemoteDataSource';

/** Pictures without text first, then the best voted: the order the title page's rails use. */
const ordered = (images: readonly ImageDto[] | null | undefined): readonly ImageDto[] =>
  [...(images ?? [])].sort(
    (a, b) =>
      Number(a.iso_639_1 != null) - Number(b.iso_639_1 != null) ||
      (b.vote_average ?? 0) - (a.vote_average ?? 0),
  );

export const makeGalleryRepository = ({
  remote,
}: {
  remote: GalleryRemoteDataSource;
}): GalleryRepository => ({
  images: async (source) => {
    const dto = await remote.images(source);
    return {
      backdrops: toSizedImages(ordered(dto.backdrops), 'galleryBackdrop'),
      posters: toSizedImages(ordered(dto.posters), 'galleryPoster'),
      profiles: toSizedImages(dto.profiles, 'galleryProfile'),
      stills: toSizedImages(dto.stills, 'galleryBackdrop'),
    };
  },
});
