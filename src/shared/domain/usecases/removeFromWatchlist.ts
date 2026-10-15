import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';

export type RemoveFromWatchlist = (refs: readonly MediaRef[]) => Promise<Outcome<void>>;

export const makeRemoveFromWatchlist =
  ({ watchlist }: { watchlist: WatchlistRepository }): RemoveFromWatchlist =>
  (refs) =>
    outcome(async () => {
      if (refs.length > 0) await watchlist.remove(refs);
    });
