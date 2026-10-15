import {
  activeFilterCount,
  defaultFilters,
  filtersFrom,
  resetFilters,
  runtimeBounds,
  toggleGenre,
  toggleProvider,
} from '@features/discover/domain/model/browseFilters';

describe('browseFilters', () => {
  it('counts nothing for the defaults', () => {
    expect(activeFilterCount(defaultFilters)).toBe(0);
  });

  it('counts each genre, the decade, the rating and a non-default sort', () => {
    expect(
      activeFilterCount({
        ...defaultFilters,
        sort: 'rating',
        genreIds: [1, 2],
        decade: 1990,
        minRating: 7,
        providerIds: [8],
        language: 'ko',
        runtime: 'short',
      }),
    ).toBe(8);
  });

  it('adds a genre that is missing and removes one that is there', () => {
    const once = toggleGenre(defaultFilters, 28);
    expect(once.genreIds).toEqual([28]);
    expect(toggleGenre(once, 28).genreIds).toEqual([]);
  });

  it('starts from a genre as a filter and from a keyword as the source', () => {
    expect(filtersFrom({ kind: 'genre', id: 28, name: 'Action' }).genreIds).toEqual([28]);
    const keyword = filtersFrom({ kind: 'keyword', id: 9882, name: 'space' });
    expect(keyword.source?.id).toBe(9882);
    expect(activeFilterCount(keyword)).toBe(0);
  });

  it('keeps the source when the filters are reset', () => {
    const filters = toggleProvider(filtersFrom({ kind: 'company', id: 41077, name: 'A24' }), 8);
    expect(resetFilters(filters)).toEqual({
      ...defaultFilters,
      source: { kind: 'company', id: 41077, name: 'A24' },
    });
  });

  it('measures shows per episode and movies whole', () => {
    expect(runtimeBounds('movie', 'long')).toEqual({ min: 151, max: null });
    expect(runtimeBounds('tv', 'short')).toEqual({ min: null, max: 29 });
  });
});
