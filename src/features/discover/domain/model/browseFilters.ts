import type { BrowseSource } from '@shared/domain/model/browseSource';

export type SortOrder = 'popularity' | 'rating' | 'newest' | 'oldest' | 'title' | 'revenue' | 'votes';

/** Revenue exists for movies only: TMDB has no box office for shows. */
export const sortOrdersFor = (type: 'movie' | 'tv'): readonly SortOrder[] =>
  type === 'movie'
    ? ['popularity', 'rating', 'votes', 'newest', 'oldest', 'revenue', 'title']
    : ['popularity', 'rating', 'votes', 'newest', 'oldest', 'title'];

/** The first year of each decade the filter offers, newest first. */
export const decades: readonly number[] = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950];

export const minimumRatings: readonly number[] = [5, 6, 7, 8];

export type RuntimeRange = 'short' | 'medium' | 'long';

export const runtimeRanges: readonly RuntimeRange[] = ['short', 'medium', 'long'];

/** Minutes per range: under 90, 90 to 150, over 150 (for shows, per episode: under 30, 30 to 60, over 60). */
export const runtimeBounds = (
  type: 'movie' | 'tv',
  range: RuntimeRange,
): { readonly min: number | null; readonly max: number | null } => {
  const [short, long] = type === 'movie' ? [90, 150] : [30, 60];
  switch (range) {
    case 'short':
      return { min: null, max: short - 1 };
    case 'medium':
      return { min: short, max: long };
    case 'long':
      return { min: long + 1, max: null };
  }
};

/** Original languages offered as filters: the most produced on TMDB plus Arabic. ISO 639-1. */
export const filterLanguages: readonly string[] = [
  'en',
  'ar',
  'es',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'zh',
  'hi',
  'tr',
  'pt',
];

export type BrowseFilters = {
  readonly sort: SortOrder;
  /** Titles must have every one of these genres. */
  readonly genreIds: readonly number[];
  readonly decade: number | null;
  readonly minRating: number | null;
  /** Available on any of these streaming services in the user's region. */
  readonly providerIds: readonly number[];
  readonly language: string | null;
  readonly runtime: RuntimeRange | null;
  /** A keyword, studio or network the user came from; genres travel in genreIds. */
  readonly source: BrowseSource | null;
};

export const defaultFilters: BrowseFilters = {
  sort: 'popularity',
  genreIds: [],
  decade: null,
  minRating: null,
  providerIds: [],
  language: null,
  runtime: null,
  source: null,
};

/** Where browsing starts: a genre preselected, or a keyword, studio or network. */
export const filtersFrom = (source: BrowseSource | null): BrowseFilters =>
  source === null
    ? defaultFilters
    : source.kind === 'genre'
      ? { ...defaultFilters, genreIds: [source.id] }
      : { ...defaultFilters, source };

/** How many filters differ from the defaults; sort counts as one, the source the user came from does not. */
export const activeFilterCount = (filters: BrowseFilters): number =>
  (filters.sort === defaultFilters.sort ? 0 : 1) +
  filters.genreIds.length +
  filters.providerIds.length +
  (filters.decade === null ? 0 : 1) +
  (filters.minRating === null ? 0 : 1) +
  (filters.language === null ? 0 : 1) +
  (filters.runtime === null ? 0 : 1);

const toggle = (ids: readonly number[], id: number): readonly number[] =>
  ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];

export const toggleGenre = (filters: BrowseFilters, genreId: number): BrowseFilters => ({
  ...filters,
  genreIds: toggle(filters.genreIds, genreId),
});

export const toggleProvider = (filters: BrowseFilters, providerId: number): BrowseFilters => ({
  ...filters,
  providerIds: toggle(filters.providerIds, providerId),
});

/** Resetting keeps the source: it is where the user is, not a filter they added. */
export const resetFilters = (filters: BrowseFilters): BrowseFilters => ({
  ...defaultFilters,
  source: filters.source,
});
