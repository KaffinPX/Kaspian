import LocalStorage from "@/storage/LocalStorage"
import SessionStorage, { ISession } from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, PrivateKeyGenerator, createTransactions, sompiToKaspaStringWithSuffix, Transaction, decryptXChaCha20Poly1305, kaspaToSompi, signTransaction } from "@/../wasm"
import type Node from "./node"
import { EventEmitter } from "events"

export interface Summary {
  fee: string
  totalAmount: string
  consumedUtxos: number
  hash: string
}
export interface Utxo {
  amount: number
  transaction: string
}

export default class Account extends EventEmitter {
  processor: UtxoProcessor
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
      changeAddress: this.addresses[1][0],
      priorityFee: 0n,
      networkId: this.processor.networkId!
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

  async submit (transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const { transactionId } = await this.processor.rpc.submitTransaction({
        transaction: Transaction.deserializeFromSafeJSON(transaction)
      })

      submittedIds.push(transactionId) 
    }

    this.emit('transaction', "") // waiting for aspects changes 

    return submittedIds
  }

  private registerProcessor() {
    this.processor.addEventListener("utxo-proc-start", async () => {
      await this.context.trackAddresses([ ...this.addresses[0], ...this.addresses[1] ])
    })

    this.processor.addEventListener('pending', (event) => {
      console.log(event)
    })

    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private async deriveAddresses (receiveCount: number, changeCount: number) {
    if (!this.session) throw Error('No active account')

    const publicKey = await PublicKeyGenerator.fromXPub(this.session.publicKey)

    this.addresses = [
      await publicKey.receiveAddressAsStrings("MAINNET", 0, receiveCount),
      await publicKey.changeAddressAsStrings("MAINNET", 0, changeCount)
    ]

    this.emit('address', this.addresses[0][this.addresses[0].length - 1])
  }

  private listenSession () {
    SessionStorage.storage.onChanged.addListener(async () => {
      const session = await SessionStorage.get('session', undefined)
    
      if (session) {
        const account = (await LocalStorage.get('wallet', undefined))!.accounts[session.activeAccount]

        this.session = session

        await this.deriveAddresses(account.receiveCount, account.changeCount)
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