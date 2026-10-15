import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { Page } from '@shared/domain/model/media';
import type { SearchResult, SearchScope } from '@features/search/domain/model/searchResult';
import type { SearchRepository } from '@features/search/domain/repositories/searchRepository';

export type SearchCatalog = (
  query: string,
  scope: SearchScope,
  page: number,
) => Promise<Outcome<Page<SearchResult>>>;

const empty: Page<SearchResult> = { items: [], page: 1, totalPages: 1, totalResults: 0 };

/** A blank query finds nothing without asking the server. */
export const makeSearchCatalog =
  ({ search }: { search: SearchRepository }): SearchCatalog =>
  (query, scope, page) =>
    outcome(async () => {
      const trimmed = query.trim();
      return trimmed === '' ? empty : search.search(trimmed, scope, page);
    });
