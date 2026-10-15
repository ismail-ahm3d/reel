import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';

/** An in-memory KeyValueStorage for tests. */
export const makeMemoryStorage = (initial: Readonly<Record<string, string>> = {}) => {
  const values = new Map(Object.entries(initial));
  const storage: KeyValueStorage = {
    getItem: async (key) => values.get(key) ?? null,
    getItemSync: (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
    removeItem: async (key) => {
      values.delete(key);
    },
  };
  return { storage, values };
};
