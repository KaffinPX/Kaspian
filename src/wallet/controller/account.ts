import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, createAddress, NetworkType, PublicKeyGenerator } from "@/../wasm"
import type Node from "./node"
import { EventEmitter } from "events"

export default class Account extends EventEmitter {
  processor: UtxoProcessor
  publicKey: PublicKeyGenerator | undefined
  addresses: [ string[], string[] ] = [[], []]
  context: UtxoContext

  constructor (node: Node) {
    super()

    this.processor = new UtxoProcessor({ rpc: node.kaspa, networkId: 'MAINNET' })
    this.context = new UtxoContext({ processor: this.processor })

    this.registerProcessor()
    this.listenSession()
  }

  get balance () {
    return this.context.balance?.toBalanceStrings('MAINNET').mature ?? "0 KAS"
  }

  private async deriveAddresses (receiveCount: number, changeCount: number) {
    const receiveKeys = await this.publicKey!.receivePubkeys(0, receiveCount)
    // const changeKeys = await this.publicKey!.changePubkeys(0, changeCount)

    for (const publicKey of receiveKeys) {
      const address = createAddress(publicKey, NetworkType.Mainnet)

      this.addresses[0].push(address.toString())
      address.free()
    }
  }

  private async registerProcessor () {
    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private listenSession () {
    SessionStorage.storage.onChanged.addListener(async () => {
      const session = await SessionStorage.get('session', undefined)
    
      if (session) {
        const account = (await LocalStorage.get('wallet', undefined))!.accounts[session.activeAccount]

        this.publicKey = await PublicKeyGenerator.fromXPub(session.publicKey)

        await this.deriveAddresses(account.receiveCount, account.changeCount)
        await this.processor.start()
        await this.context.trackAddresses([ ...this.addresses[0], ...this.addresses[1] ])
      } else {
        this.publicKey!.free()

        delete this.publicKey
        this.addresses = [[], []]
        await this.context.clear()
      }
    })
  }
}