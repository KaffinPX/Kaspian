import { PublicKeyGenerator } from "@/../wasm"

export default class Addresses {
  publicKey: PublicKeyGenerator | undefined
  networkId: string
  receiveAddresses: string[] = []
  changeAddresses: string[] = []

  constructor (networkId: string) {
    this.networkId = networkId
  }

  get allAddresses () {
    return [ ...this.receiveAddresses, ...this.changeAddresses ]
  }

  async derive (isReceive: boolean, start: number, end: number) {
    if (!this.publicKey) throw Error('No active account')

    if (isReceive) {
      return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
    } else {
      return this.publicKey.changeAddressAsStrings(this.networkId, start, end)
    }
  }

  async increment (receiveCount: number, changeCount: number) {
    const [ receiveAddresses, changeAddresses ] = await Promise.all([
      this.derive(true, this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
      this.derive(false, this.changeAddresses.length, this.changeAddresses.length + changeCount)
    ]) 
    
    this.receiveAddresses.push(...receiveAddresses)
    this.changeAddresses.push(...changeAddresses)
    
    return [ receiveAddresses, changeAddresses ]
  }

  async setNetworkId (networkId: string) {
    this.networkId = networkId
    this.receiveAddresses = await this.derive(true, 0, this.receiveAddresses.length)
    this.changeAddresses = await this.derive(false, 0, this.changeAddresses.length)
  }

  reset () {
    delete this.publicKey

    this.receiveAddresses = []
    this.changeAddresses = []
  }
}