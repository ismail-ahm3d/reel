import Storage from 'expo-sqlite/kv-store';
import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';

/** Adapts expo-sqlite's key-value store, persisted on the device. */
export const makeDeviceStorage = (): KeyValueStorage => ({
  getItem: (key) => Storage.getItem(key),
  getItemSync: (key) => Storage.getItemSync(key),
  setItem: (key, value) => Storage.setItem(key, value),
  removeItem: (key) => Storage.removeItem(key),
});
