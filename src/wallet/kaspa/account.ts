import LocalStorage from "@/storage/LocalStorage"
import SessionStorage, { ISession } from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, PrivateKeyGenerator, createTransactions, Transaction, decryptXChaCha20Poly1305, kaspaToSompi, signTransaction } from "@/../wasm"
import type Node from "./node"
import { EventEmitter } from "events"
 
export interface Utxo {
  amount: number
  transaction: string
}

export default class Account extends EventEmitter {
  processor: UtxoProcessor
  publicKey: PublicKeyGenerator | undefined
  session: ISession | undefined
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
    return Number(this.context.balance?.mature ?? 0) / 1e8
  }

  get utxos () {
    const utxos = this.context.getMatureRange(0, this.context.getMatureLength)

    return utxos.map(utxo => ({
      amount: Number(utxo.amount) / 1e8,
      transaction: utxo.getTransactionId()
    }))
  }

  async createSend (recipient: string, amount: string) {
    const { transactions } = await createTransactions({
      entries: this.context,
      outputs: [{ 
        address: recipient,
        amount: kaspaToSompi(amount)!
      }],
      changeAddress: this.addresses[1][this.addresses[1].length - 1],
      priorityFee: 0n,
      networkId: this.processor.networkId!
    })

    // TODO: increment changeAddress

    return transactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async sign (transactions: string[], password: string) {
    const keyGenerator = new PrivateKeyGenerator(decryptXChaCha20Poly1305(this.session!.encryptedKey, password), false, BigInt(this.session!.activeAccount))
    const signedTransactions: Transaction[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const privateKeys = []

      for (const address of parsedTransaction.addresses('MAINNET')) {
        const receiveIndex = this.addresses[0].indexOf(address.toString())
        const changeIndex = this.addresses[1].indexOf(address.toString())

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

  private registerProcessor() {
    this.processor.addEventListener("utxo-proc-start", async () => {
      await this.context.clear()
      await this.context.trackAddresses([ ...this.addresses[0], ...this.addresses[1] ])
    })

    this.processor.addEventListener('pending', async (event) => {
      // await this.incrementAddresses(0, 1)

      // TODO: Update LocalStorage
    })

    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private async incrementAddresses (receiveCount: number, changeCount: number) {
    if (!this.publicKey) throw Error('No active account')

    this.addresses[0].push(...await this.publicKey.receiveAddressAsStrings('MAINNET', this.addresses[0].length, this.addresses[0].length + receiveCount))
    this.addresses[1].push(...await this.publicKey.changeAddressAsStrings('MAINNET', this.addresses[1].length, this.addresses[1].length + changeCount))

    if (receiveCount !== 0) this.emit('address', this.addresses[0][this.addresses[0].length - 1])
  }

  private listenSession () {
    SessionStorage.storage.onChanged.addListener(async () => {
      const session = await SessionStorage.get('session', undefined)
    
      if (session) {
        const account = (await LocalStorage.get('wallet', undefined))!.accounts[session.activeAccount]

        this.session = session
        this.publicKey = await PublicKeyGenerator.fromXPub(this.session.publicKey)

        await this.incrementAddresses(account.receiveCount, account.changeCount)

        await this.processor.start()
      } else {
        delete this.session
        this.addresses = [[], []]

        await this.context.clear()
        await this.processor.stop()
      }
    })
  }
}