import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';
import { storageOutcome, storageOutcomeSync } from '@shared/core/data/storageOutcome';
import {
  settingsRecordSchema,
  type SettingsRecord,
} from '@features/settings/data/datasources/storage/settingsRecord';

const key = 'settings.v1';

/** Every function may throw AppError; nothing else. */
export type SettingsStorageDataSource = {
  readonly read: () => Promise<SettingsRecord | null>;
  readonly readSync: () => SettingsRecord | null;
  readonly write: (record: SettingsRecord) => Promise<void>;
};

const parse = (raw: string | null): SettingsRecord | null =>
  raw === null ? null : settingsRecordSchema.parse(JSON.parse(raw));

export const makeSettingsStorageDataSource = ({
  storage,
}: {
  storage: KeyValueStorage;
}): SettingsStorageDataSource => ({
  read: () => storageOutcome(async () => parse(await storage.getItem(key))),
  readSync: () => storageOutcomeSync(() => parse(storage.getItemSync(key))),
  write: (record) => storageOutcome(() => storage.setItem(key, JSON.stringify(record))),
});
