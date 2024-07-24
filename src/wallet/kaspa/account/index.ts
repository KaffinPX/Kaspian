import { EventEmitter } from "events"
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, type UtxoEntryReference } from "@/../wasm"
import type Node from "../node"
import Addresses from "./addresses"
import SessionStorage from "@/storage/SessionStorage"
import Transactions from "./transactions"

export interface UTXO {
  amount: number
  transaction: string,
  mature: boolean
}

export default class Account extends EventEmitter  {
  processor: UtxoProcessor
  addresses: Addresses
  context: UtxoContext
  transactions: Transactions

  constructor (node: Node) {
    super()

    this.processor = new UtxoProcessor({ rpc: node.kaspa, networkId: node.networkId })
    this.context = new UtxoContext({ processor: this.processor })
    this.addresses = new Addresses(this.context, node.networkId)
    this.transactions = new Transactions(node.kaspa, this.context, this.addresses)

    node.on('network', async (networkId: string) => {
      if (this.processor.isActive) {
        await this.processor.stop()
        this.processor.setNetworkId(networkId)
        await this.processor.start()
      } else {
        this.processor.setNetworkId(networkId)
      }

      await this.addresses.changeNetwork(networkId)
    })

    this.registerProcessor()
    this.listenSession()
  }

  get balance () {
    return Number(this.context.balance?.mature ?? 0) / 1e8
  }

  get UTXOs () {
    const mapUTXO = (utxo: UtxoEntryReference, mature: boolean) => ({
      amount: Number(utxo.amount) / 1e8,
      transaction: utxo.getTransactionId(),
      mature
    })

    const pendingUTXOs = this.context.getPending().map(utxo => mapUTXO(utxo, false))
    const matureUTXOs = this.context.getMatureRange(0, this.context.matureLength).map(utxo => mapUTXO(utxo, true))

    return [ ...pendingUTXOs, ...matureUTXOs ]
  }

  async scan (steps = 50, count = 10) {
    // TODO: Review
    const scanAddresses = async (isReceive: boolean, startIndex: number) => {
      let foundIndex = 0

      for (let index = 0; index < steps; index++) {
        const addresses = await this.addresses.derive(isReceive, startIndex, startIndex + count)
        startIndex += count
    
        const { entries } = await this.processor.rpc.getUtxosByAddresses(addresses)
    
        // TODO: more accurate index by findIndex over addresses by last entry

        if (entries.length > 0) { foundIndex = startIndex }
      }

      await this.addresses.increment(isReceive ? foundIndex : 0, isReceive ? 0 : foundIndex)
    }
  
    await scanAddresses(true, this.addresses.receiveAddresses.length)
    await scanAddresses(false, this.addresses.changeAddresses.length)
  }

  private registerProcessor () {
    this.processor.addEventListener("utxo-proc-start", async () => {
      await this.context.clear()
      await this.context.trackAddresses(this.addresses.allAddresses)
    })

    this.processor.addEventListener('pending', async (event) => {
      const utxos = event.data.data.utxoEntries

      if (utxos.some(utxo => utxo.address?.toString() === this.addresses.receiveAddresses[this.addresses.receiveAddresses.length - 1])) {
        await this.addresses.increment(1, 0)
      }
    })

    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private listenSession () {
    SessionStorage.subscribeChanges(async (key, newValue) => {
      if (key !== 'session') return

      if (newValue) {
        await this.addresses.import(PublicKeyGenerator.fromXPub(newValue.publicKey), newValue.activeAccount)
        await this.transactions.import(newValue.encryptedKey, newValue.activeAccount)
        await this.processor.start()
      } else {
        this.addresses.reset()
        this.transactions.reset()
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}