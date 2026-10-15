import type { GetPopularPeople } from '@features/search/domain/usecases/getPopularPeople';
import type { GetTrendingNow } from '@features/search/domain/usecases/getTrendingNow';
import type { SearchCatalog } from '@features/search/domain/usecases/searchCatalog';

export type SearchUseCases = {
  readonly searchCatalog: SearchCatalog;
  readonly getTrendingNow: GetTrendingNow;
  readonly getPopularPeople: GetPopularPeople;
};
