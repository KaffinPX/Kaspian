import browser from "webextension-polyfill"
import { ISettings } from "../contexts/Settings"
import Storage from "./Storage"

export interface IWallet {
  encryptedKey: string
  accounts: IAccount[]
}

export interface IAccount {
  name: string
  encryptedKey: string
  receiveCount: number
  changeCount: number
}

export interface ILocalStorage {
  settings: ISettings
  wallet: IWallet | undefined
}

export default new (class LocalStorage extends Storage<ILocalStorage> {
  storage = browser.storage.local
})()
