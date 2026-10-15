import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { Genre } from '@shared/domain/model/genre';
import type { MediaType } from '@shared/domain/model/media';
import type { GenreRepository } from '@shared/domain/repositories/genreRepository';

export type GetGenres = (type: MediaType) => Promise<Outcome<readonly Genre[]>>;

export const makeGetGenres =
  ({ genres }: { genres: GenreRepository }): GetGenres =>
  (type) =>
    outcome(async () => [...(await genres.list(type))].sort((a, b) => a.name.localeCompare(b.name)));
