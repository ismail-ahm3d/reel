import { toMediaSummary } from '@shared/data/mappers/tmdbMappers';
import { sameMedia, type MediaSummary, type MediaType } from '@shared/domain/model/media';
import type { Session } from '@shared/domain/model/session';
import type { WatchlistEntry } from '@shared/domain/model/watchlistEntry';
import type { SessionRepository } from '@shared/domain/repositories/sessionRepository';
import type { WatchlistRepository } from '@shared/domain/repositories/watchlistRepository';
import type { AccountWatchlistRemoteDataSource } from '@shared/data/datasources/remote/accountWatchlistRemoteDataSource';
import type { WatchlistStorageDataSource } from '@shared/data/datasources/storage/watchlistStorageDataSource';
import { toWatchlistEntry, toWatchlistRecord } from '@shared/data/mappers/watchlistMappers';

/** Enough for any real watchlist while keeping the first open quick. */
const maxPages = 10;

/** TMDB's v3 watchlist takes one title per request; a few at a time stays under its rate limit. */
const concurrentWrites = 5;

const inBatches = async <T>(items: readonly T[], run: (item: T) => Promise<void>): Promise<void> => {
  for (let start = 0; start < items.length; start += concurrentWrites) {
    await Promise.all(items.slice(start, start + concurrentWrites).map(run));
  }
};

/**
 * The device's watchlist while signed out, the TMDB account's while signed in. Titles saved on
 * the device before signing in move to the account the first time it is read.
 */
export const makeWatchlistRepository = ({
  local,
  remote,
  sessions,
}: {
  local: WatchlistStorageDataSource;
  remote: AccountWatchlistRemoteDataSource;
  sessions: SessionRepository;
}): WatchlistRepository => {
  const allOf = async (session: Session, type: MediaType): Promise<readonly MediaSummary[]> => {
    const first = await remote.page(session, type, 1);
    const pages = Math.min(first.total_pages, maxPages);
    const rest = await Promise.all(
      Array.from({ length: Math.max(pages - 1, 0) }, (_, index) => remote.page(session, type, index + 2)),
    );
    return [first, ...rest].flatMap((page) => page.results.map((dto) => toMediaSummary(dto, type)));
  };

  const migrate = async (session: Session) => {
    const records = await local.read();
    if (records.length === 0) return;
    await inBatches(records, (record) => remote.set(session, record.type, record.id, true));
    await local.write([]);
  };

  return {
    list: async () => {
      const session = await sessions.current();
      if (session === null) return (await local.read()).map(toWatchlistEntry);
      await migrate(session);
      const [movies, shows] = await Promise.all([allOf(session, 'movie'), allOf(session, 'tv')]);
      // TMDB keeps the order titles were added in but not the dates; newer first, a second apart.
      const now = Date.now();
      const merged: WatchlistEntry[] = [];
      for (let index = 0; index < Math.max(movies.length, shows.length); index += 1) {
        const movie = movies[index];
        const show = shows[index];
        if (movie !== undefined) merged.push({ media: movie, addedAt: new Date(now - merged.length * 1000) });
        if (show !== undefined) merged.push({ media: show, addedAt: new Date(now - merged.length * 1000) });
      }
      return merged;
    },
    add: async (entries) => {
      const session = await sessions.current();
      if (session !== null) {
        await inBatches(entries, (entry) =>
          remote.set(session, entry.media.ref.type, entry.media.ref.id, true),
        );
        return;
      }
      const records = await local.read();
      const others = records.filter(
        (record) =>
          !entries.some((entry) => sameMedia({ type: record.type, id: record.id }, entry.media.ref)),
      );
      await local.write([...others, ...entries.map(toWatchlistRecord)]);
    },
    remove: async (refs) => {
      const session = await sessions.current();
      if (session !== null) {
        await inBatches(refs, (ref) => remote.set(session, ref.type, ref.id, false));
        return;
      }
      const records = await local.read();
      await local.write(
        records.filter((record) => !refs.some((ref) => sameMedia({ type: record.type, id: record.id }, ref))),
      );
    },
  };
};
