import type { MediaRef } from '@shared/domain/model/media';
import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';

/** Every function may throw AppError; nothing else. */
export type WatchlistRepository = {
  readonly list: () => Promise<readonly WatchlistEntry[]>;
  /** Saves every entry; titles already saved stay where they are. */
  readonly add: (entries: readonly WatchlistEntry[]) => Promise<void>;
  readonly remove: (refs: readonly MediaRef[]) => Promise<void>;
};
