import {
  Mnemonic,
  XPrivateKey,
  XPrv,
  XPublicKey
} from "../../../wasm/kaspa_wasm"
import Account from "./Account"

export default class Wallet {
  root: string

  constructor(mnemonics: Mnemonic, password: string) {
    const seed = mnemonics.toSeed(password)

    this.root = new XPrv(seed).intoString("xprv")
  }

  async openAccount(index: number) {
    const publicKey = await XPublicKey.fromMasterXPrv(
      this.root,
      false,
      BigInt(index)
    )
    const privateKey = new XPrivateKey(this.root, false, 0n)

    return new Account(publicKey, privateKey)
  }
}
