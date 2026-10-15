import type { GetCollection } from '@features/title/domain/usecases/getCollection';
import type { GetEpisode } from '@features/title/domain/usecases/getEpisode';
import type { GetReviews } from '@features/title/domain/usecases/getReviews';
import type { GetSeason } from '@features/title/domain/usecases/getSeason';
import type { GetTitleDetails } from '@features/title/domain/usecases/getTitleDetails';

export type TitleUseCases = {
  readonly getTitleDetails: GetTitleDetails;
  readonly getSeason: GetSeason;
  readonly getEpisode: GetEpisode;
  readonly getCollection: GetCollection;
  readonly getReviews: GetReviews;
};
