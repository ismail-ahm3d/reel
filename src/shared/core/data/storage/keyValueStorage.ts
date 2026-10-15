/** A string key-value store. Implementations may throw anything; callers wrap with storageOutcome. */
export type KeyValueStorage = {
  readonly getItem: (key: string) => Promise<string | null>;
  /** For values the app needs before its first frame; keep them small. */
  readonly getItemSync: (key: string) => string | null;
  readonly setItem: (key: string, value: string) => Promise<void>;
  readonly removeItem: (key: string) => Promise<void>;
};
