import type { MediaType } from '@shared/domain/model/media';

/** Keys of the data several features read: the watchlist and the genre lists. */
export const watchlistKeys = {
  all: ['watchlist'] as const,
};

export const genreKeys = {
  all: ['genres'] as const,
  list: (type: MediaType) => ['genres', type] as const,
};
