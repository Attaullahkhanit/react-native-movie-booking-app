import { Storage } from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';

/**
 * Synchronous key-value store (SQLite-backed, bundled in Expo Go) shared by the
 * Zustand stores and the React Query offline cache. The sync API means
 * persisted state is available on the very first render (no hydration flash).
 */
export const kvStorage = {
  getItem: (key: string) => Storage.getItemSync(key),
  setItem: (key: string, value: string) => Storage.setItemSync(key, value),
  removeItem: (key: string) => {
    Storage.removeItemSync(key);
  },
};

export const zustandStorage: StateStorage = kvStorage;
