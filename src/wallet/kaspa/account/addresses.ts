import { PublicKeyGenerator, UtxoContext } from "@/../wasm"
import LocalStorage from "@/storage/LocalStorage"
import { EventEmitter } from "events"

export default class Addresses extends EventEmitter {
  context: UtxoContext
  publicKey: PublicKeyGenerator | undefined
  accountId: number | undefined
  networkId: string // TODO: can be derived from context
  receiveAddresses: string[] = []
  changeAddresses: string[] = []

  constructor (context: UtxoContext, networkId: string) {
    super()

    this.context = context
    this.networkId = networkId
  }

  get allAddresses () {
    return [ ...this.receiveAddresses, ...this.changeAddresses ]
  }

  async import (publicKey: PublicKeyGenerator, accountId: number) {
    this.publicKey = publicKey
    this.accountId = accountId

    const account = (await LocalStorage.get('wallet', undefined))!.accounts[accountId]

    await this.increment(account.receiveCount, account.changeCount, false)
  }

  async derive (isReceive: boolean, start: number, end: number) {
    if (!this.publicKey) throw Error('No active account')

    if (isReceive) {
      return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
    } else {
      return this.publicKey.changeAddressAsStrings(this.networkId, start, end)
    }
  }

  async increment (receiveCount: number, changeCount: number, commit = true) {
    const addresses = await Promise.all([
      this.derive(true, this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
      this.derive(false, this.changeAddresses.length, this.changeAddresses.length + changeCount)
    ]) 
    
    this.receiveAddresses.push(...addresses[0])
    this.changeAddresses.push(...addresses[1])
    
    if (this.context.isActive) await this.context.trackAddresses(addresses.flat())
    if (commit) await this.commit()

    this.emit('addresses', addresses)
  }

  async changeNetwork (networkId: string) {
    this.networkId = networkId
    this.receiveAddresses = await this.derive(true, 0, this.receiveAddresses.length)
    this.changeAddresses = await this.derive(false, 0, this.changeAddresses.length)
  }

  reset () {
    delete this.publicKey
    delete this.accountId

    this.receiveAddresses = []
    this.changeAddresses = []
  }

  private async commit () {
    const wallet = (await LocalStorage.get('wallet', undefined))!
    const account = wallet.accounts[this.accountId!]
  
    account.receiveCount = this.receiveAddresses.length
    account.changeCount = this.changeAddresses.length
    
    await LocalStorage.set('wallet', wallet)  
  }
}