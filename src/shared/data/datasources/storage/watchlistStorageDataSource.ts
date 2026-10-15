import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';
import { storageOutcome } from '@shared/core/data/storageOutcome';
import {
  watchlistRecordsSchema,
  type WatchlistRecord,
} from '@shared/data/datasources/storage/watchlistRecord';

const key = 'watchlist.v1';

/** Every function may throw AppError; nothing else. */
export type WatchlistStorageDataSource = {
  readonly read: () => Promise<readonly WatchlistRecord[]>;
  readonly write: (records: readonly WatchlistRecord[]) => Promise<void>;
};

export const makeWatchlistStorageDataSource = ({
  storage,
}: {
  storage: KeyValueStorage;
}): WatchlistStorageDataSource => ({
  read: () =>
    storageOutcome(async () => {
      const raw = await storage.getItem(key);
      return raw === null ? [] : watchlistRecordsSchema.parse(JSON.parse(raw));
    }),
  write: (records) => storageOutcome(() => storage.setItem(key, JSON.stringify(records))),
});
