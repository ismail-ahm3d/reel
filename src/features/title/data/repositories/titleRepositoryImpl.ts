import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';
import type { TitleRemoteDataSource } from '@features/title/data/datasources/remote/titleRemoteDataSource';
import {
  movieToDetails,
  toCollection,
  toEpisodeDetails,
  toReviewPage,
  toSeasonDetails,
  tvToDetails,
} from '@features/title/data/mappers/titleMappers';

export const makeTitleRepository = ({
  remote,
  region,
  language,
}: {
  remote: TitleRemoteDataSource;
  region: string;
  /** ISO 639-1, to pick the logo in the user's language. */
  language: string;
}): TitleRepository => ({
  details: async (ref) =>
    ref.type === 'movie'
      ? movieToDetails(await remote.movie(ref.id), region, language)
      : tvToDetails(await remote.tv(ref.id), region, language),
  season: async (showId, seasonNumber) => toSeasonDetails(await remote.season(showId, seasonNumber), showId),
  episode: async (showId, seasonNumber, episodeNumber) =>
    toEpisodeDetails(await remote.episode(showId, seasonNumber, episodeNumber), showId),
  collection: async (id) => toCollection(await remote.collection(id)),
  reviews: async (ref, page) => toReviewPage(await remote.reviews(ref.type, ref.id, page)),
});
