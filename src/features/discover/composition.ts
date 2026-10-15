import type { Clock } from '@shared/core/domain/clock';
import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { DiscoverUseCases } from '@features/discover/domain/usecases/discoverUseCases';
import { makeBrowseTitles } from '@features/discover/domain/usecases/browseTitles';
import { makeGetCategoryPage } from '@features/discover/domain/usecases/getCategoryPage';
import { makeGetStreamingServices } from '@features/discover/domain/usecases/getStreamingServices';
import { makeDiscoverRemoteDataSource } from '@features/discover/data/datasources/remote/discoverRemoteDataSource';
import { makeDiscoverRepository } from '@features/discover/data/repositories/discoverRepositoryImpl';

export type DiscoverClients = {
  readonly http: HttpClient;
  readonly clock: Clock;
  readonly region: string;
};

export const makeDiscover = ({ http, clock, region }: DiscoverClients): DiscoverUseCases => {
  const discover = makeDiscoverRepository({
    remote: makeDiscoverRemoteDataSource({ http, clock, region }),
    region,
  });
  return {
    getCategoryPage: makeGetCategoryPage({ discover }),
    browseTitles: makeBrowseTitles({ discover }),
    getStreamingServices: makeGetStreamingServices({ discover }),
  };
};
