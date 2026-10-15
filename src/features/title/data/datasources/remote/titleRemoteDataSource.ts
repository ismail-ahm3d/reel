import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import type { MediaType } from '@shared/domain/model/media';
import {
  collectionDtoSchema,
  episodeDtoSchema,
  movieDetailsDtoSchema,
  reviewPageDtoSchema,
  seasonDtoSchema,
  tvDetailsDtoSchema,
  type CollectionDto,
  type EpisodeDto,
  type MovieDetailsDto,
  type ReviewPageDto,
  type SeasonDto,
  type TvDetailsDto,
} from '@features/title/data/datasources/remote/titleDto';

/** Every function may throw AppError; nothing else. */
export type TitleRemoteDataSource = {
  readonly movie: (id: number) => Promise<MovieDetailsDto>;
  readonly tv: (id: number) => Promise<TvDetailsDto>;
  readonly season: (showId: number, seasonNumber: number) => Promise<SeasonDto>;
  readonly episode: (showId: number, seasonNumber: number, episodeNumber: number) => Promise<EpisodeDto>;
  readonly collection: (id: number) => Promise<CollectionDto>;
  readonly reviews: (type: MediaType, id: number, page: number) => Promise<ReviewPageDto>;
};

/** One request per screen: TMDB appends the related lists to the details response. */
const shared = 'videos,images,recommendations,similar,watch/providers,keywords,external_ids';
const movieAppend = `credits,release_dates,${shared}`;
const tvAppend = `aggregate_credits,content_ratings,${shared}`;

/**
 * Images are filtered by language: the app's, then English, then language-neutral ones, so a
 * logo exists for nearly every title. Reviews are requested without a language: TMDB filters
 * them by the request language, and nearly all of them are in English.
 */
export const makeTitleRemoteDataSource = ({
  http,
  language,
}: {
  http: HttpClient;
  language: string;
}): TitleRemoteDataSource => {
  const include_image_language = [...new Set([language, 'en', 'null'])].join(',');
  // Videos are filtered by the request language too; most trailers are English.
  const include_video_language = include_image_language;
  return {
    movie: (id) =>
      remoteOutcome(async () =>
        movieDetailsDtoSchema.parse(
          await http.get(`movie/${id}`, {
            append_to_response: movieAppend,
            include_image_language,
            include_video_language,
          }),
        ),
      ),
    tv: (id) =>
      remoteOutcome(async () =>
        tvDetailsDtoSchema.parse(
          await http.get(`tv/${id}`, {
            append_to_response: tvAppend,
            include_image_language,
            include_video_language,
          }),
        ),
      ),
    season: (showId, seasonNumber) =>
      remoteOutcome(async () => seasonDtoSchema.parse(await http.get(`tv/${showId}/season/${seasonNumber}`))),
    episode: (showId, seasonNumber, episodeNumber) =>
      remoteOutcome(async () =>
        episodeDtoSchema.parse(
          await http.get(`tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`, {
            append_to_response: 'images',
            include_image_language,
          }),
        ),
      ),
    collection: (id) =>
      remoteOutcome(async () => collectionDtoSchema.parse(await http.get(`collection/${id}`))),
    reviews: (type, id, page) =>
      remoteOutcome(async () =>
        reviewPageDtoSchema.parse(await http.get(`${type}/${id}/reviews`, { page, language: 'en-US' })),
      ),
  };
};
