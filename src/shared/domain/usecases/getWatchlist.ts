import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';

export type GetWatchlist = () => Promise<Outcome<readonly WatchlistEntry[]>>;

/** Most recently added first. */
export const makeGetWatchlist =
  ({ watchlist }: { watchlist: WatchlistRepository }): GetWatchlist =>
  () =>
    outcome(async () =>
      [...(await watchlist.list())].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()),
    );
