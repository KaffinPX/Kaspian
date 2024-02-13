import { Mnemonic, encryptXChaCha20Poly1305, decryptXChaCha20Poly1305, XPrv, XPub, XPublicKey, XPrivateKey } from "@/../wasm"

import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import Account from "./account"

export enum Status {
  Uninitialized,
  Locked,
  Unlocked
}

export default class Wallet {
  status: Status = Status.Uninitialized
  activeAccount: Account | undefined

  constructor (readyCallback: () => void) {
    this.sync().then(() => readyCallback())
  }

  async unlock (id: number, password: string) {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) throw Error('Wallet is not initialized')

    const mnemonic = new Mnemonic(decryptXChaCha20Poly1305(wallet.encryptedKey, password))
    const extendedKey = new XPrv(mnemonic.toSeed())
    const publicKey = await XPublicKey.fromMasterXPrv(
      extendedKey.intoString('xprv'),
      false,
      0n
    )
    
    await SessionStorage.set('session', {
      activeAccount: id,
      publicKey: publicKey.toKPub()
    })
  }

  async import (mnemonics: string, password: string) {
    try {
      const mnemonic = new Mnemonic(mnemonics)

      mnemonic.free()
    } catch (err) {
      throw Error('Invalid mnemonic')
    }
  
    await LocalStorage.set("wallet", {
      encryptedKey: encryptXChaCha20Poly1305(mnemonics, password),
      accounts: []
    })

    return true // a simple workaround on some weird ts problem, will be thinked over it more in future
  }

  async create (password: string) {
    const mnemonic = Mnemonic.random(24)
    const phrase = mnemonic.phrase

    mnemonic.free()
    await this.import(phrase, password)

    return phrase
  }

  async sync () {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      this.status = Status.Uninitialized
    } else {
      const session = await SessionStorage.get('session', undefined)

      if (!session) {
        this.status = Status.Locked
      } else {
        this.status = Status.Unlocked

        this.activeAccount = new Account(await XPublicKey.fromXPub(session.publicKey))
      }
    }
  }
}

export async function createAccount (password: string) {
  const wallet = await LocalStorage.get('wallet', undefined)

  if (typeof wallet === 'undefined') throw Error('create wallet first')

  await wallet.accounts.push({
    name: "Unknown",
    receiveCount: 0,
    changeCount: 0
  })
}
