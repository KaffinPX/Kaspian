import LocalStorage from "@/storage/LocalStorage"
import SessionStorage, { ISession } from "@/storage/SessionStorage"
import { UtxoContext, UtxoProcessor, createAddress, NetworkType, PublicKeyGenerator, PrivateKeyGenerator, createTransactions, sompiToKaspaStringWithSuffix, type PendingTransaction, decryptXChaCha20Poly1305, Mnemonic, XPrv, kaspaToSompi } from "@/../wasm"
import type Node from "./node"
import { EventEmitter } from "events"

export interface Summary {
  fee: string
  totalAmount: string
  consumedUtxos: number
  hash: string,
}

export default class Account extends EventEmitter {
  processor: UtxoProcessor
  session: ISession | undefined
  addresses: [ string[], string[] ] = [[], []]
  context: UtxoContext
  pendingTxs: PendingTransaction[] = []

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

  async initiateSend (recipient: string, amount: string) {
    const { transactions, summary } = await createTransactions({
      entries: this.context,
      outputs: [{ 
        address: recipient,
        amount: kaspaToSompi(amount)!
      }],
      changeAddress: this.addresses[1][0],
      priorityFee: 0n
    })

    this.pendingTxs = transactions

    return {
      fee: sompiToKaspaStringWithSuffix(summary.fees, summary.networkType),
      totalAmount: sompiToKaspaStringWithSuffix(summary.finalAmount!, summary.networkType),
      consumedUtxos: summary.utxos,
      hash: summary.finalTransactionId!
    }
  }

  async signPendings (password: string) {
    if (this.pendingTxs.length === 0) throw Error('No any pending transactions')

    const keyGenerator = new PrivateKeyGenerator(decryptXChaCha20Poly1305(this.session!.encryptedKey, password), false, BigInt(this.session!.activeAccount))

    for (const transaction of this.pendingTxs) {
      const privateKeys = []

      for (const address of transaction.addresses) {
        const receiveIndex = this.addresses[0].indexOf(address)
        const changeIndex = this.addresses[1].indexOf(address)

        if (receiveIndex !== -1) {
          privateKeys.push(keyGenerator.receiveKey(receiveIndex))
        } else if (changeIndex !== -1) {
          privateKeys.push(keyGenerator.changeKey(changeIndex))
        } else throw Error('UTXO(address) is not owned by wallet')
      }

      transaction.sign(privateKeys)
    }
  }

  async submitSigned () {
    for (const transaction of this.pendingTxs) {
      await transaction.submit(this.processor.rpc)
    }
  }

  private async deriveAddresses (receiveCount: number, changeCount: number) {
    if (!this.session) throw Error('No active account')

    const publicKey = await PublicKeyGenerator.fromXPub(this.session.publicKey)

    this.addresses = [
      await publicKey.receiveAddressAsStrings("MAINNET", 0, receiveCount),
      await publicKey.changeAddressAsStrings("MAINNET", 0, changeCount)
    ]
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

        this.session = session

        await this.deriveAddresses(account.receiveCount, account.changeCount)
        await this.processor.start()
        await this.context.trackAddresses([ ...this.addresses[0], ...this.addresses[1] ])
      } else {
        delete this.session
        this.addresses = [[], []]
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}