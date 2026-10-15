import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import type { MediaType } from '@shared/domain/model/media';
import { genreListDtoSchema, type GenreListDto } from '@shared/data/datasources/remote/tmdbDto';

/** Every function may throw AppError; nothing else. */
export type GenreRemoteDataSource = {
  readonly fetch: (type: MediaType) => Promise<GenreListDto>;
};

export const makeGenreRemoteDataSource = ({ http }: { http: HttpClient }): GenreRemoteDataSource => ({
  fetch: (type) => remoteOutcome(async () => genreListDtoSchema.parse(await http.get(`genre/${type}/list`))),
});
