import browser from "webextension-polyfill"
import { ISettings } from "../contexts/Settings"
import Storage from "./Storage"

export interface IWallet {
  name: string
  encrypted_mnemonics: string
  accounts: IAccount[]
  mnemonics?: string
}

export interface IAccount {
  name: string
  receiveKeys: number
  changeKeys: number
}

export interface ILocalStorage {
  settings: ISettings
  wallets: IWallet[]
}

export default new (class LocalStorage extends Storage<ILocalStorage> {
  storage = browser.storage.local
})()
