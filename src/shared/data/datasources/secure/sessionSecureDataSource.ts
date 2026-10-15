import { z } from 'zod';
import type { SecureStorage } from '@shared/core/data/storage/secureStorage';
import { storageOutcome } from '@shared/core/data/storageOutcome';

const key = 'tmdb.session.v1';

export const sessionRecordSchema = z.object({
  accessToken: z.string(),
  accountObjectId: z.string(),
  sessionId: z.string(),
  accountId: z.number(),
});

export type SessionRecord = z.infer<typeof sessionRecordSchema>;

/** Every function may throw AppError; nothing else. */
export type SessionSecureDataSource = {
  readonly read: () => Promise<SessionRecord | null>;
  readonly write: (record: SessionRecord) => Promise<void>;
  readonly remove: () => Promise<void>;
};

export const makeSessionSecureDataSource = ({
  secure,
}: {
  secure: SecureStorage;
}): SessionSecureDataSource => ({
  read: () =>
    storageOutcome(async () => {
      const raw = await secure.getItem(key);
      return raw === null ? null : sessionRecordSchema.parse(JSON.parse(raw));
    }),
  write: (record) => storageOutcome(() => secure.setItem(key, JSON.stringify(record))),
  remove: () => storageOutcome(() => secure.removeItem(key)),
});
