import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { makeGetCollection } from '@features/title/domain/usecases/getCollection';
import { makeGetEpisode } from '@features/title/domain/usecases/getEpisode';
import { makeGetReviews } from '@features/title/domain/usecases/getReviews';
import { makeGetSeason } from '@features/title/domain/usecases/getSeason';
import { makeGetTitleDetails } from '@features/title/domain/usecases/getTitleDetails';
import { makeTitleRemoteDataSource } from '@features/title/data/datasources/remote/titleRemoteDataSource';
import { makeTitleRepository } from '@features/title/data/repositories/titleRepositoryImpl';

export const makeTitle = ({
  http,
  region,
  language,
}: {
  http: HttpClient;
  region: string;
  language: string;
}): TitleUseCases => {
  const titles = makeTitleRepository({
    remote: makeTitleRemoteDataSource({ http, language }),
    region,
    language,
  });
  return {
    getTitleDetails: makeGetTitleDetails({ titles }),
    getSeason: makeGetSeason({ titles }),
    getEpisode: makeGetEpisode({ titles }),
    getCollection: makeGetCollection({ titles }),
    getReviews: makeGetReviews({ titles }),
  };
};
