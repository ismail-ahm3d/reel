import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { EpisodeDetails } from '@features/title/domain/model/episode';
import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';

export type GetEpisode = (
  showId: number,
  seasonNumber: number,
  episodeNumber: number,
) => Promise<Outcome<EpisodeDetails>>;

export const makeGetEpisode =
  ({ titles }: { titles: TitleRepository }): GetEpisode =>
  (showId, seasonNumber, episodeNumber) =>
    outcome(() => titles.episode(showId, seasonNumber, episodeNumber));
