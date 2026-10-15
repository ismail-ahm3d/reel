import type { Clock } from '@shared/core/domain/clock';
import { outcome, type Outcome } from '@shared/core/domain/outcome';
import { sameMedia, type MediaSummary } from '@shared/domain/model/media';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';

/** Adds the title if it is missing, removes it if it is there. Returns whether it is now saved. */
export type ToggleWatchlist = (media: MediaSummary) => Promise<Outcome<boolean>>;

export const makeToggleWatchlist =
  ({ watchlist, clock }: { watchlist: WatchlistRepository; clock: Clock }): ToggleWatchlist =>
  (media) =>
    outcome(async () => {
      const saved = (await watchlist.list()).some((entry) => sameMedia(entry.media.ref, media.ref));
      if (saved) {
        await watchlist.remove([media.ref]);
        return false;
      }
      await watchlist.add([{ media, addedAt: clock.now() }]);
      return true;
    });
