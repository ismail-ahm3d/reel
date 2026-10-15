import type { AppError } from '@shared/core/domain/appError';
import { sameMedia } from '@shared/domain/model/media';
import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';

export const makeFakeWatchlistRepository = (initial: readonly WatchlistEntry[] = []) => {
  let entries = [...initial];
  let failure: AppError | null = null;
  const guard = () => {
    if (failure !== null) throw failure;
  };
  const repository: WatchlistRepository = {
    list: async () => {
      guard();
      return entries;
    },
    add: async (added) => {
      guard();
      entries = [
        ...entries.filter((e) => !added.some((entry) => sameMedia(e.media.ref, entry.media.ref))),
        ...added,
      ];
    },
    remove: async (refs) => {
      guard();
      entries = entries.filter((e) => !refs.some((ref) => sameMedia(e.media.ref, ref)));
    },
  };
  return {
    repository,
    failWith: (error: AppError | null) => {
      failure = error;
    },
    stored: () => entries,
  };
};
