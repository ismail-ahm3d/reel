import type { Clock } from '@shared/core/domain/clock';
import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaSummary } from '@shared/domain/model/media';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';

/** Saves several titles at once; the first one given ends up the most recent. */
export type AddToWatchlist = (media: readonly MediaSummary[]) => Promise<Outcome<void>>;

export const makeAddToWatchlist =
  ({ watchlist, clock }: { watchlist: WatchlistRepository; clock: Clock }): AddToWatchlist =>
  (media) =>
    outcome(async () => {
      if (media.length === 0) return;
      const now = clock.now().getTime();
      await watchlist.add(media.map((item, index) => ({ media: item, addedAt: new Date(now - index) })));
    });
