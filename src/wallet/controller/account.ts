import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import { createAddress, NetworkType, PublicKeyGenerator } from "@/../wasm"

export default class Account {
  publicKey: PublicKeyGenerator | undefined
  // TODO: support networks && indexing of index

  async deriveReceive () {
    if (!this.publicKey) throw Error('Account is not imported')

    const publicKey = (await this.publicKey.receivePubkeys(0, 1))[0]
    const address = createAddress(publicKey, NetworkType.Mainnet)
    
    return address.toString()
  }

  async import () {
    const session = await SessionStorage.get('session', undefined)

    if (!session) throw Error('Cant import while theres no any active account')

    this.publicKey = await PublicKeyGenerator.fromXPub(session.publicKey)
    // const account = (await LocalStorage.get('wallet', undefined)!)?.accounts[session.activeAccount]
  }
}