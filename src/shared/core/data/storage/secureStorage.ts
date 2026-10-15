import * as SecureStore from 'expo-secure-store';

/** Small secrets kept in the Keychain (iOS) or the Keystore (Android). May throw; callers wrap. */
export type SecureStorage = {
  readonly getItem: (key: string) => Promise<string | null>;
  readonly getItemSync: (key: string) => string | null;
  readonly setItem: (key: string, value: string) => Promise<void>;
  readonly removeItem: (key: string) => Promise<void>;
};

export const makeSecureStorage = (): SecureStorage => ({
  getItem: (key) => SecureStore.getItemAsync(key),
  getItemSync: (key) => SecureStore.getItem(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
});
