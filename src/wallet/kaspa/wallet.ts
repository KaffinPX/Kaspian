import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import { Mnemonic, encryptXChaCha20Poly1305, decryptXChaCha20Poly1305, XPrv, PublicKeyGenerator } from "@/../wasm"
import { EventEmitter } from "events"

export enum Status {
  Uninitialized,
  Locked,
  Unlocked
}

export default class Wallet extends EventEmitter {
  status: Status = Status.Uninitialized

  constructor (readyCallback: () => void) {
    super()

    this.sync().then(() => readyCallback())
  }

  async create (password: string) {
    const mnemonic = Mnemonic.random(24)
    await this.import(mnemonic.phrase, password)

    return mnemonic.phrase
  }

  async import (mnemonics: string, password: string) {
    if (!Mnemonic.validate(mnemonics)) throw Error('Invalid mnemonic')
  
    await LocalStorage.set("wallet", {
      encryptedKey: encryptXChaCha20Poly1305(mnemonics, password),
      accounts: [{
        name: "Wallet",
        receiveCount: 1,
        changeCount: 1      
      }]
    })

    await this.unlock(0, password) // instead of this, implement low level functs to reuse classes/available things to make it faster
    await this.sync()
  }

  async unlock (id: number, password: string) {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) throw Error('Wallet is not initialized')

    const mnemonic = new Mnemonic(decryptXChaCha20Poly1305(wallet.encryptedKey, password))
    const extendedKey = new XPrv(mnemonic.toSeed())
    const publicKey = await PublicKeyGenerator.fromMasterXPrv(
      extendedKey,
      false,
      BigInt(id)
    )
    
    await SessionStorage.set('session', {
      activeAccount: id,
      publicKey: publicKey.toString(),
      encryptedKey: encryptXChaCha20Poly1305(extendedKey.toString(), password)
    })

    await this.sync()
  }

  async lock () {
    await SessionStorage.remove('session')
    await this.sync()
  }

  async reset () {
    await LocalStorage.remove('wallet')
    await SessionStorage.clear()
    await this.sync()
  }

  private async sync () {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      this.markStatus(Status.Uninitialized)
    } else {
      const session = await SessionStorage.get('session', undefined)

      if (!session) {
        this.markStatus(Status.Locked)
      } else {
        this.markStatus(Status.Unlocked)
      }
    }
  }

  private async markStatus (status: Status) {
    this.status = status

    this.emit('status', status)
  }
}
