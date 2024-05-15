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
  
  private async sync () {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      this.status = Status.Uninitialized
    } else {
      const session = await SessionStorage.get('session', undefined)

      this.status = session ? Status.Unlocked : Status.Locked;
    }

    this.emit('status', this.status)
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

    await this.unlock(0, password)
    await this.sync()
  }

  async unlock (id: number, password: string) {
    const mnemonic = new Mnemonic(await this.export(password))
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

  async export (password: string) {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) throw Error('Wallet is not initialized')

    return decryptXChaCha20Poly1305(wallet.encryptedKey, password)
  }

  async lock () {
    await SessionStorage.remove('session')
    await this.sync()
  }

  async reset () {
    await SessionStorage.clear()
    await LocalStorage.remove('wallet')
    await this.sync()
  }
}
