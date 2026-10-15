import type { Genre } from '@shared/domain/model/genre';
import type { MediaType } from '@shared/domain/model/media';

/** Every function may throw AppError; nothing else. */
export type GenreRepository = {
  readonly list: (type: MediaType) => Promise<readonly Genre[]>;
};
