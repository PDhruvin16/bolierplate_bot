// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Centralized keys used across the app
// export const StorageKeys = {
//   accessToken: 'authToken',
//   refreshToken: 'refreshToken',
//   user: 'userData',
// } as const;

// type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys] | string;

// function safeParse<T>(value: string | null): T | null {
//   if (value == null) return null;
//   try {
//     return JSON.parse(value) as T;
//   } catch (_) {
//     return null;
//   }
// }

// export const storage = {
//   // Primitive/string helpers
//   async setString(key: StorageKey, value: string): Promise<void> {
//     await AsyncStorage.setItem(key, value);
//   },

//   async getString(key: StorageKey): Promise<string | null> {
//     return AsyncStorage.getItem(key);
//   },

//   // JSON helpers
//   async setJSON<T>(key: StorageKey, value: T): Promise<void> {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   },

//   async getJSON<T>(key: StorageKey): Promise<T | null> {
//     const raw = await AsyncStorage.getItem(key);
//     return safeParse<T>(raw);
//   },

//   async remove(key: StorageKey): Promise<void> {
//     await AsyncStorage.removeItem(key);
//   },

//   async clear(): Promise<void> {
//     await AsyncStorage.clear();
//   },

//   async keys(): Promise<string[]> {
//     return AsyncStorage.getAllKeys();
//   },

//   async multiRemove(keys: StorageKey[]): Promise<void> {
//     await AsyncStorage.multiRemove(keys);
//   },

//   async multiSetString(entries: Array<[StorageKey, string]>): Promise<void> {
//     await AsyncStorage.multiSet(entries);
//   },

//   // Auth-specific helpers
//   async setTokens(tokens: { access: string; refresh: string }): Promise<void> {
//     await AsyncStorage.multiSet([
//       [StorageKeys.accessToken, tokens.access],
//       [StorageKeys.refreshToken, tokens.refresh],
//     ]);
//   },

//   async getAccessToken(): Promise<string | null> {
//     return AsyncStorage.getItem(StorageKeys.accessToken);
//   },

//   async getRefreshToken(): Promise<string | null> {
//     return AsyncStorage.getItem(StorageKeys.refreshToken);
//   },

//   async clearAuth(): Promise<void> {
//     await AsyncStorage.multiRemove([
//       StorageKeys.accessToken,
//       StorageKeys.refreshToken,
//       StorageKeys.user,
//     ]);
//   },

//   // User helpers
//   async setUser<T extends object = any>(user: T): Promise<void> {
//     await AsyncStorage.setItem(StorageKeys.user, JSON.stringify(user));
//   },

//   async getUser<T extends object = any>(): Promise<T | null> {
//     const raw = await AsyncStorage.getItem(StorageKeys.user);
//     return safeParse<T>(raw);
//   },

//   async updateUserPartial<T extends object = any>(
//     partial: Partial<T>,
//   ): Promise<T | null> {
//     const current = (await storage.getUser<T>()) || ({} as T);
//     const updated = { ...current, ...partial } as T;
//     await storage.setUser<T>(updated);
//     return updated;
//   },
// };

// export default storage;
import { createMMKV } from 'react-native-mmkv';

// Initialize MMKV instance
const mmkvStorage = createMMKV();

// Centralized keys used across the app
export const StorageKeys = {
  accessToken: 'authToken',
  refreshToken: 'refreshToken',
  user: 'userData',
} as const;

type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys] | string;

function safeParse<T>(value: string | undefined): T | null {
  if (value == null) return null;
  try {
    return JSON.parse(value) as T;
  } catch (_) {
    return null;
  }
}

export const storage = {
  // Primitive/string helpers
  setString(key: StorageKey, value: string): void {
    mmkvStorage.set(key, value);
  },

  getString(key: StorageKey): string | null {
    const value = mmkvStorage.getString(key);
    return value ?? null;
  },

  // JSON helpers
  setJSON<T>(key: StorageKey, value: T): void {
    mmkvStorage.set(key, JSON.stringify(value));
  },

  getJSON<T>(key: StorageKey): T | null {
    const raw = mmkvStorage.getString(key);
    return safeParse<T>(raw);
  },

  remove(key: StorageKey): void {
    mmkvStorage.delete(key);
  },

  clear(): void {
    mmkvStorage.clearAll();
  },

  keys(): string[] {
    return mmkvStorage.getAllKeys();
  },

  multiRemove(keys: StorageKey[]): void {
    keys.forEach(key => mmkvStorage.delete(key));
  },

  multiSetString(entries: Array<[StorageKey, string]>): void {
    entries.forEach(([key, value]) => mmkvStorage.set(key, value));
  },

  // Auth-specific helpers
  setTokens(tokens: { access: string; refresh: string }): void {
    mmkvStorage.set(StorageKeys.accessToken, tokens.access);
    mmkvStorage.set(StorageKeys.refreshToken, tokens.refresh);
  },

  getAccessToken(): string | null {
    const value = mmkvStorage.getString(StorageKeys.accessToken);
    return value ?? null;
  },

  getRefreshToken(): string | null {
    const value = mmkvStorage.getString(StorageKeys.refreshToken);
    return value ?? null;
  },

  clearAuth(): void {
    mmkvStorage.delete(StorageKeys.accessToken);
    mmkvStorage.delete(StorageKeys.refreshToken);
    mmkvStorage.delete(StorageKeys.user);
  },

  // User helpers
  setUser<T extends object = any>(user: T): void {
    mmkvStorage.set(StorageKeys.user, JSON.stringify(user));
  },

  getUser<T extends object = any>(): T | null {
    const raw = mmkvStorage.getString(StorageKeys.user);
    return safeParse<T>(raw);
  },

  updateUserPartial<T extends object = any>(
    partial: Partial<T>,
  ): T | null {
    const current = storage.getUser<T>() || ({} as T);
    const updated = { ...current, ...partial } as T;
    storage.setUser<T>(updated);
    return updated;
  },
};

export default storage;