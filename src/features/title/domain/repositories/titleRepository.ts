import type { MediaRef, Page } from '@shared/domain/model/media';
import type { Collection } from '@features/title/domain/model/collection';
import type { EpisodeDetails } from '@features/title/domain/model/episode';
import type { SeasonDetails } from '@features/title/domain/model/season';
import type { Review, TitleDetails } from '@features/title/domain/model/titleDetails';

/** Every function may throw AppError; nothing else. */
export type TitleRepository = {
  readonly details: (ref: MediaRef) => Promise<TitleDetails>;
  readonly season: (showId: number, seasonNumber: number) => Promise<SeasonDetails>;
  readonly episode: (showId: number, seasonNumber: number, episodeNumber: number) => Promise<EpisodeDetails>;
  readonly collection: (id: number) => Promise<Collection>;
  readonly reviews: (ref: MediaRef, page: number) => Promise<Page<Review>>;
};
