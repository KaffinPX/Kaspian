import { Mnemonic, encryptXChaCha20Poly1305, decryptXChaCha20Poly1305, XPrv, XPub, XPublicKey, XPrivateKey } from "wasm"

import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import Account from "./account"

export enum Status {
  Synchronizing,
  Uninitialized,
  Locked,
  Unlocked
}

// XPrv => XPublicKey && XPrivateKey

export default class Wallet {
  status: Status
  activeAccount: Account | undefined

  constructor () {
    this.status = Status.Synchronizing

    this.sync()
  }

  async import (mnemonics: string, password: string) {
    // TODO: Validate mnemonics
  
    await LocalStorage.set("wallet", {
      encryptedKey: encryptXChaCha20Poly1305(mnemonics, password),
      accounts: []
    })
  }

  async create (password: string) {
    const mnemonics = Mnemonic.random(24)
    const phrase = mnemonics.phrase
    mnemonics.free()
  
    await this.import(phrase, password)
  
    return phrase
  }

  async sync () {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (typeof wallet === 'undefined') {
      this.status = Status.Uninitialized
    } else {
      const session = await SessionStorage.get('session', undefined)

      if (typeof session === 'undefined') {
        this.status = Status.Locked
      } else {
        this.status = Status.Unlocked

        this.activeAccount = new Account(await XPublicKey.fromXPub(session.publicKey))
        // TODO: parse session and export account
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
