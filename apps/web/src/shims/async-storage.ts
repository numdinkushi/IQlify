type AsyncStorageValue = string | null;

const AsyncStorageShim = {
  async getItem(_key: string): Promise<AsyncStorageValue> {
    return null;
  },
  async setItem(_key: string, _value: string): Promise<void> {
    return;
  },
  async removeItem(_key: string): Promise<void> {
    return;
  },
  async clear(): Promise<void> {
    return;
  },
  async getAllKeys(): Promise<string[]> {
    return [];
  },
  async multiGet(keys: readonly string[]): Promise<[string, AsyncStorageValue][]> {
    return keys.map((key) => [key, null]);
  },
  async multiSet(_entries: readonly [string, string][]): Promise<void> {
    return;
  },
  async multiRemove(_keys: readonly string[]): Promise<void> {
    return;
  }
};

export default AsyncStorageShim;
export const {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  multiGet,
  multiSet,
  multiRemove
} = AsyncStorageShim;

