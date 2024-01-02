import browser from "webextension-polyfill"
import { IWallet } from "./LocalStorage"
import Storage from "./Storage"

export interface ISessionStorage {
  active_wallet: IWallet | undefined
}

export default new (class SessionStorage extends Storage<ISessionStorage> {
  storage = browser.storage.session
})()
