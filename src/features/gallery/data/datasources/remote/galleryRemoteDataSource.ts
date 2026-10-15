import { z } from 'zod';
import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import { imageDtoSchema } from '@shared/data/datasources/remote/tmdbDto';
import type { GallerySource } from '@shared/domain/model/gallerySource';

const listOf = z.array(imageDtoSchema).nullish();

export const imagesDtoSchema = z.object({
  backdrops: listOf,
  posters: listOf,
  profiles: listOf,
  stills: listOf,
});

export type ImagesDto = z.infer<typeof imagesDtoSchema>;

/** Every function may throw AppError; nothing else. */
export type GalleryRemoteDataSource = {
  readonly images: (source: GallerySource) => Promise<ImagesDto>;
};

const pathOf = (source: GallerySource): string =>
  source.kind === 'episode'
    ? `tv/${source.id}/season/${source.season}/episode/${source.episode}/images`
    : `${source.kind}/${source.id}/images`;

/** Same language order as the title page: the app's, English, then pictures without text. */
export const makeGalleryRemoteDataSource = ({
  http,
  language,
}: {
  http: HttpClient;
  language: string;
}): GalleryRemoteDataSource => ({
  images: (source) =>
    remoteOutcome(async () =>
      imagesDtoSchema.parse(
        await http.get(pathOf(source), {
          include_image_language: [...new Set([language, 'en', 'null'])].join(','),
        }),
      ),
    ),
});
