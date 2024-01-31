import { createAddress, NetworkType, XPublicKey } from "@/../wasm"

export default class Account {
  publicKey: XPublicKey
  // TODO: support networks && indexing of index

  constructor (publicKey: XPublicKey) {
    this.publicKey = publicKey
  }

  async deriveReceive () {
    return createAddress(await this.publicKey.receivePubkeys(0, 0), NetworkType.Mainnet)
  }
}