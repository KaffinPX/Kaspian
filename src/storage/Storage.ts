import browser from "webextension-polyfill"

export default abstract class Storage<
  IStorage extends Record<string, any> = Record<string, any>
> {
  abstract storage: browser.Storage.StorageArea

  async get<key extends keyof IStorage>(
    key: key,
    defaultValue: IStorage[key]
  ): Promise<IStorage[key]> {
    if (typeof key !== "string") throw new Error("key must be a string")
    try {
      const result = await this.storage.get(key as string)
      return JSON.parse(result[key as string])
    } catch (err) {
      return defaultValue
    }
  }

  async set<key extends keyof IStorage>(
    key: key,
    value: IStorage[key]
  ): Promise<void> {
    await this.storage.set({ [key]: JSON.stringify(value) })
  }

  async remove<key extends keyof IStorage>(key: key): Promise<void> {
    await this.storage.remove(key as string)
  }

  async clear(): Promise<void> {
    await this.storage.clear()
  }

  async getAll(): Promise<IStorage> {
    const result = await this.storage.get(null)
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [key, JSON.parse(value)])
    ) as IStorage
  }
}
