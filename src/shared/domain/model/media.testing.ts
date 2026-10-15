import type { MediaSummary, MediaType } from '@shared/domain/model/media';

/** A complete MediaSummary for tests; override what the test is about. */
export const aMedia = (
  overrides: Partial<MediaSummary> & { readonly id?: number; readonly type?: MediaType } = {},
): MediaSummary => {
  const { id = 1, type = 'movie', ...rest } = overrides;
  return {
    ref: { type, id },
    title: `Title ${id}`,
    overview: '',
    year: 2024,
    rating: 7.5,
    voteCount: 100,
    poster: { small: 'p-s', medium: 'p-m', large: 'p-l' },
    backdrop: null,
    genreIds: [],
    ...rest,
  };
};
