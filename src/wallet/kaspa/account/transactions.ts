import { createTransactions, decryptXChaCha20Poly1305, kaspaToSompi, PendingTransaction, PrivateKeyGenerator, RpcClient, signTransaction, Transaction, UtxoContext } from "@/../wasm"
import Addresses from "./addresses"
import EventEmitter from "events"

export default class Transactions extends EventEmitter {
  kaspa: RpcClient
  context: UtxoContext
  addresses: Addresses
  encryptedKey: string | undefined
  accountId: number | undefined

  private transactions: Map<string, PendingTransaction> = new Map()

  constructor (kaspa: RpcClient, context: UtxoContext, addresses: Addresses) {
    super()
    
    this.kaspa = kaspa
    this.context = context
    this.addresses = addresses
  }

  async import (encryptedKey: string, accountId: number) {
    this.encryptedKey = encryptedKey
    this.accountId = accountId
  }

  async create (outputs: [ string, string ][], fee: string) {
    const { transactions } = await createTransactions({
      entries: this.context,
      outputs: outputs.map(output => ({ address: output[0], amount: kaspaToSompi(output[1])! })),
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      priorityFee: kaspaToSompi(fee)!,
    })

    await this.addresses.increment(0, 1)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    return transactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async sign (transactions: string[], password: string) {
    if (!this.encryptedKey) throw Error('No imported account')

    const keyGenerator = new PrivateKeyGenerator(decryptXChaCha20Poly1305(this.encryptedKey, password), false, BigInt(this.accountId!))
    const signedTransactions: Transaction[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const privateKeys = []

      for (const address of parsedTransaction.addresses(this.addresses.networkId)) {
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
    
    const parsedTransactions = signedTransactions.map(transaction => transaction.serializeToSafeJSON())
    this.emit('transactions', parsedTransactions)

    return parsedTransactions
  }

  async submitContextful (transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const cachedTransaction = this.transactions.get(parsedTransaction.id)

      if (!cachedTransaction) throw Error('Transaction is not generated by wallet')

      for (let i = 0; i < parsedTransaction.inputs.length; i++) {
        const input = parsedTransaction.inputs[i]
        cachedTransaction.fillInput(i, input.signatureScript)
      }

      submittedIds.push(await cachedTransaction.submit(this.kaspa))
    }

    return submittedIds
  }

  reset () {
    delete this.encryptedKey
    delete this.accountId
  }
}