import LocalStorage from "@/storage/LocalStorage"
import SessionStorage from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, createAddress, NetworkType, PublicKeyGenerator, createTransactions, sompiToKaspaStringWithSuffix } from "@/../wasm"
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

  get utxos (): [ string, string ][] {
    const utxos = this.context.getMatureRange(0, this.context.getMatureLength)

    return utxos.map(utxo => [ sompiToKaspaStringWithSuffix(utxo.amount, this.processor.networkId!), utxo.getId() ])
  }

  async createTransactions (recipient: string, amount: string) {
    const transaction = await createTransactions({
      entries: this.context,
      outputs: [{ address: recipient, amount: BigInt(amount) }],
      changeAddress: this.addresses[0][0],
    })

    transaction.transactions.forEach(transaction => {
      transaction.getUtxoEntries
    })

  }

  private async deriveAddresses (receiveCount: number, changeCount: number) {
    const receiveKeys = await this.publicKey!.receivePubkeysAsStrings(0, receiveCount)
    // const changeKeys = await this.publicKey!.changePubkeys(0, changeCount)

    for (const publicKey of receiveKeys) {
      const address = createAddress(publicKey, NetworkType.Mainnet)

      this.addresses[0].push(address.toString())
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
        delete this.publicKey
        this.addresses = [[], []]
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}