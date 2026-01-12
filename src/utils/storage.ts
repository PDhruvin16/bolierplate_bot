import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralized keys used across the app
export const StorageKeys = {
  accessToken: 'authToken',
  refreshToken: 'refreshToken',
  user: 'userData',
} as const;

type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys] | string;

function safeParse<T>(value: string | null): T | null {
  if (value == null) return null;
  try {
    return JSON.parse(value) as T;
  } catch (_) {
    return null;
  }
}

export const storage = {
  // Primitive/string helpers
  async setString(key: StorageKey, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getString(key: StorageKey): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  // JSON helpers
  async setJSON<T>(key: StorageKey, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async getJSON<T>(key: StorageKey): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return safeParse<T>(raw);
  },

  async remove(key: StorageKey): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },

  async keys(): Promise<string[]> {
    return AsyncStorage.getAllKeys();
  },

  async multiRemove(keys: StorageKey[]): Promise<void> {
    await AsyncStorage.multiRemove(keys);
  },

  async multiSetString(entries: Array<[StorageKey, string]>): Promise<void> {
    await AsyncStorage.multiSet(entries);
  },

  // Auth-specific helpers
  async setTokens(tokens: { access: string; refresh: string }): Promise<void> {
    await AsyncStorage.multiSet([
      [StorageKeys.accessToken, tokens.access],
      [StorageKeys.refreshToken, tokens.refresh],
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(StorageKeys.accessToken);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(StorageKeys.refreshToken);
  },

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([
      StorageKeys.accessToken,
      StorageKeys.refreshToken,
      StorageKeys.user,
    ]);
  },

  // User helpers
  async setUser<T extends object = any>(user: T): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.user, JSON.stringify(user));
  },

  async getUser<T extends object = any>(): Promise<T | null> {
    const raw = await AsyncStorage.getItem(StorageKeys.user);
    return safeParse<T>(raw);
  },

  async updateUserPartial<T extends object = any>(
    partial: Partial<T>,
  ): Promise<T | null> {
    const current = (await storage.getUser<T>()) || ({} as T);
    const updated = { ...current, ...partial } as T;
    await storage.setUser<T>(updated);
    return updated;
  },
};

export default storage;
