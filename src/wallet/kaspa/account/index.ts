import LocalStorage from "@/storage/LocalStorage"
import SessionStorage, { ISession } from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, PrivateKeyGenerator, createTransactions, Transaction, decryptXChaCha20Poly1305, kaspaToSompi, signTransaction, type UtxoEntryReference } from "@/../wasm"
import type Node from "../node"
import { EventEmitter } from "events"
import Addresses from "./addresses"
 
export interface UTXO {
  amount: number
  transaction: string,
  mature: boolean
}

export default class Account extends EventEmitter  {
  processor: UtxoProcessor
  addresses: Addresses
  session: ISession | undefined
  context: UtxoContext

  constructor (node: Node) {
    super()

    this.addresses = new Addresses()
    this.processor = new UtxoProcessor({ rpc: node.kaspa, networkId: 'MAINNET' })
    this.context = new UtxoContext({ processor: this.processor })

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

    const matureUTXOs = this.context.getMatureRange(0, this.context.matureLength).map(utxo => mapUTXO(utxo, true))
    const pendingUTXOs = this.context.getPending().map(utxo => mapUTXO(utxo, false))

    return [ ...matureUTXOs, ...pendingUTXOs ]
  }

  async createSend (recipient: string, amount: string) {
    await this.incrementAddresses(0, 1)

    const { transactions } = await createTransactions({
      entries: this.context,
      outputs: [{ 
        address: recipient,
        amount: kaspaToSompi(amount)!
      }],
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      priorityFee: 0n,
    })

    return transactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async sign (transactions: string[], password: string) {
    const keyGenerator = new PrivateKeyGenerator(decryptXChaCha20Poly1305(this.session!.encryptedKey, password), false, BigInt(this.session!.activeAccount))
    const signedTransactions: Transaction[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const privateKeys = []

      for (const address of parsedTransaction.addresses('MAINNET')) {
        const receiveIndex = this.addresses.receiveAddresses.indexOf(address.toString())
        const changeIndex = this.addresses.changeAddresses.indexOf(address.toString())

        if (receiveIndex !== -1) {
          privateKeys.push(keyGenerator.receiveKey(receiveIndex))
        } else if (changeIndex !== -1) {
          privateKeys.push(keyGenerator.changeKey(changeIndex))
        } else throw Error('UTXO is not owned by active wallet')
      }

      signedTransactions.push(signTransaction(parsedTransaction, privateKeys, false))
    }
    
    return signedTransactions.map(transaction => transaction.serializeToSafeJSON())
  }

  async scan (steps = 50, count = 10) {
    const scanAddresses = async (isReceive: boolean, startIndex: number) => {
      let foundIndex = 0

      for (let index = 0; index < steps; index++) {
        const addresses = await this.addresses.derive(isReceive, startIndex, startIndex + count)
        startIndex += count
    
        const utxos = await this.processor.rpc.getUtxosByAddresses(addresses)
    
        if (utxos.entries.length > 0) { foundIndex = startIndex }
      }

      await this.incrementAddresses(isReceive ? foundIndex : 0, isReceive ? 0 : foundIndex)
    }
  
    await scanAddresses(true, this.addresses.receiveAddresses.length - 1)
    await scanAddresses(false, this.addresses.changeAddresses.length - 1)
  }

  private registerProcessor () {
    this.processor.addEventListener("utxo-proc-start", async () => {
      await this.context.clear()
      await this.context.trackAddresses(this.addresses.allAddresses)
    })

    this.processor.addEventListener('pending', async (event) => {
      const utxos = event.data.data.utxoEntries

      if (utxos.some(utxo => utxo.address?.toString() === this.addresses.receiveAddresses[this.addresses.receiveAddresses.length - 1])) {
        await this.incrementAddresses(1, 0)
      }
    })

    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private async incrementAddresses (receiveCount: number, changeCount: number) {
    const addresses = await this.addresses.increment(receiveCount, changeCount)
    if (addresses.length > 0 && this.processor.isActive) await this.context.trackAddresses(addresses)
    
    const wallet = (await LocalStorage.get('wallet', undefined))!
    const account = wallet.accounts[this.session!.activeAccount]

    account.receiveCount = this.addresses.receiveAddresses.length
    account.changeCount = this.addresses.changeAddresses.length

    await LocalStorage.set('wallet', wallet)

    this.emit('address', "") // a temporary fix for change address count not updating, must be fixed soon
  }

  private listenSession () {
    SessionStorage.subscribeChanges(async (key, newValue) => {
      if (key !== 'session') return

      if (newValue) {
        this.session = newValue // TODO: Possibly get rid of this w account set optimizations
        this.addresses.publicKey = await PublicKeyGenerator.fromXPub(this.session.publicKey)

        const account = (await LocalStorage.get('wallet', undefined))!.accounts[this.session.activeAccount]
        
        await this.incrementAddresses(account.receiveCount, account.changeCount)
        await this.processor.start()
      } else {
        delete this.session

        this.addresses.reset()
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}