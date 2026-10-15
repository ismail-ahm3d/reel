import type { AppSettings } from '@features/settings/domain/model/appSettings';

/** Every function may throw AppError; nothing else. */
export type SettingsRepository = {
  /** null until the user has changed something. */
  readonly read: () => Promise<AppSettings | null>;
  /** The same read, synchronous, for the first frame. */
  readonly readNow: () => AppSettings | null;
  readonly save: (settings: AppSettings) => Promise<void>;
};
