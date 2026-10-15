import type { MediaSummary } from '@shared/domain/model/media';

export type WatchlistEntry = {
  readonly media: MediaSummary;
  readonly addedAt: Date;
};
