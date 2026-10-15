import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary } from '@shared/domain/model/media';
import type { SearchRepository } from '@features/search/domain/repositories/searchRepository';

export type GetTrendingNow = () => Promise<Outcome<readonly MediaSummary[]>>;

export const makeGetTrendingNow =
  ({ search }: { search: SearchRepository }): GetTrendingNow =>
  () =>
    outcome(() => search.trending());
