import type { SearchScope } from '@features/search/domain/model/searchResult';

/** Every query key of the feature, built here and nowhere else. */
export const searchKeys = {
  all: ['search'] as const,
  results: (query: string, scope: SearchScope) => ['search', 'results', query, scope] as const,
  trending: ['search', 'trending'] as const,
  people: ['search', 'people'] as const,
};
