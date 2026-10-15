import type { MediaSummary, Page } from '@shared/domain/model/media';
import type { PersonSummary } from '@shared/domain/model/person';
import type { SearchResult, SearchScope } from '@features/search/domain/model/searchResult';

/** Every function may throw AppError; nothing else. */
export type SearchRepository = {
  readonly search: (query: string, scope: SearchScope, page: number) => Promise<Page<SearchResult>>;
  /** Movies and shows trending today. */
  readonly trending: () => Promise<readonly MediaSummary[]>;
  readonly popularPeople: () => Promise<readonly PersonSummary[]>;
};
