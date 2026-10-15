import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { SeasonDetails } from '@features/title/domain/model/season';
import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';

export type GetSeason = (showId: number, seasonNumber: number) => Promise<Outcome<SeasonDetails>>;

export const makeGetSeason =
  ({ titles }: { titles: TitleRepository }): GetSeason =>
  (showId, seasonNumber) =>
    outcome(() => titles.season(showId, seasonNumber));
