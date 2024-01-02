import {
  XPublicKey,
  XPrivateKey,
  createAddress,
  NetworkType
} from "../../../wasm/kaspa_wasm"

export default class Account {
  publicKey: XPublicKey
  privateKey: XPrivateKey

  constructor(publicKey: XPublicKey, privateKey: XPrivateKey) {
    this.publicKey = publicKey
    this.privateKey = privateKey
    // TODO: Network of account
  }

  async deriveAddress() {
    const publicKey = (await this.publicKey.receivePubkeys(0, 1))[0]

    return createAddress(publicKey, NetworkType["Mainnet"]).toString()
  }
}
