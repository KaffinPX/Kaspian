import * as kaspa from "kaspa-wasm" // I have a feeling like this is not going to work
import LocalStorage, { IWallet } from "../storage/LocalStorage"
import SessionStorage from "../storage/SessionStorage"

export default class Store {
  wallets: IWallet[] = []
  activeWallet: IWallet | undefined

  constructor(callback: Function) {
    this.reload().then(() => callback())
  }

  async reload() {
    this.wallets = await LocalStorage.get("wallets", [])
    this.activeWallet = await SessionStorage.get("active_wallet", undefined)

    if (typeof this.activeWallet !== "undefined") return true

    return false
  }

  async create(name: string, password: string, mnemonics?: string) {
    const finalMnemonics = mnemonics ?? kaspa.Mnemonic.random().phrase

    const walletId = this.wallets.push({
      name: name,
      encrypted_mnemonics: kaspa.encryptXChaCha20Poly1305(
        finalMnemonics,
        password
      ),
      accounts: []
    })

    await LocalStorage.set("wallets", this.wallets)

    return {
      id: walletId,
      mnemonics: finalMnemonics
    }
  }

  async unlock(index: number, password: string) {
    const unlockingWallet = this.wallets[index]
    kaspa.unlockingWallet.mnemonics = await Cryptography.decryptMnemonics(
      unlockingWallet.encrypted_mnemonics,
      password
    )

    await SessionStorage.set("active_wallet", unlockingWallet)
    this.activeWallet = unlockingWallet
  }

  async lock() {
    await SessionStorage.remove("active_wallet")
    delete this.activeWallet
  }
}
