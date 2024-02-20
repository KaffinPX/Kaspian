import { createAddress, NetworkType, PublicKeyGenerator } from "@/../wasm"

export default class Account {
  publicKey: PublicKeyGenerator
  // TODO: support networks && indexing of index

  constructor (publicKey: PublicKeyGenerator) {
    this.publicKey = publicKey
  }

  async deriveReceive () {
    const address = createAddress((await this.publicKey.receivePubkeys(0, 0))[0], NetworkType.Mainnet)
    
    return address.toString()
  }
}