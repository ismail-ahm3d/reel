import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { SearchUseCases } from '@features/search/domain/usecases/searchUseCases';
import { makeGetPopularPeople } from '@features/search/domain/usecases/getPopularPeople';
import { makeGetTrendingNow } from '@features/search/domain/usecases/getTrendingNow';
import { makeSearchCatalog } from '@features/search/domain/usecases/searchCatalog';
import { makeSearchRemoteDataSource } from '@features/search/data/datasources/remote/searchRemoteDataSource';
import { makeSearchRepository } from '@features/search/data/repositories/searchRepositoryImpl';

export const makeSearch = ({ http }: { http: HttpClient }): SearchUseCases => {
  const search = makeSearchRepository({ remote: makeSearchRemoteDataSource({ http }) });
  return {
    searchCatalog: makeSearchCatalog({ search }),
    getTrendingNow: makeGetTrendingNow({ search }),
    getPopularPeople: makeGetPopularPeople({ search }),
  };
};
