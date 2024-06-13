import { PublicKeyGenerator } from "@/../wasm"

export default class Addresses {
  publicKey: PublicKeyGenerator | undefined
  receiveAddresses: string[] = []
  changeAddresses: string[] = []
  
  get allAddresses () {
    return [ ...this.receiveAddresses, ...this.changeAddresses]
  }

  async derive (isReceive: boolean, start: number, end: number) {
    if (!this.publicKey) throw Error('No active account')

    if (isReceive) {
      return this.publicKey.receiveAddressAsStrings('MAINNET', start, end)
    } else {
      return this.publicKey.changeAddressAsStrings('MAINNET', start, end)
    }
  }

  async increment (receiveCount: number, changeCount: number) {
    if (!this.publicKey) throw Error('No active account')

    const [ receiveAddresses, changeAddresses ] = await Promise.all([
      this.publicKey.receiveAddressAsStrings('MAINNET', this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
      this.publicKey.changeAddressAsStrings('MAINNET', this.changeAddresses.length, this.changeAddresses.length + changeCount)
    ]) 
    
    this.receiveAddresses.push(...receiveAddresses)
    this.changeAddresses.push(...changeAddresses)
    
    return [ ...receiveAddresses, ...changeAddresses ]
  }

  reset () {
    delete this.publicKey

    this.receiveAddresses = []
    this.changeAddresses = []
  }
}