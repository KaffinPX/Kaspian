import { EventEmitter } from "events"
import { RpcClient, ConnectStrategy, Transaction, Resolver, NetworkId } from "@/../wasm"

export default class Node extends EventEmitter {
  kaspa: RpcClient
  networkId: string = "MAINNET"

  constructor () {
    super()

    this.kaspa = new RpcClient()
    this.registerEvents()
  }

  get connected () {
    return this.kaspa.isConnected
  }

  async submit (transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const { transactionId } = await this.kaspa.submitTransaction({
        transaction: Transaction.deserializeFromSafeJSON(transaction)
      })

      submittedIds.push(transactionId) 
    }

    return submittedIds
  }

  async reconnect (nodeAddress: string) {
    await this.kaspa.disconnect()

    if (!nodeAddress.startsWith('ws')) {
      if (!this.kaspa.resolver) this.kaspa.setResolver(new Resolver())
      this.kaspa.setNetworkId(new NetworkId(nodeAddress))
    }

    await this.kaspa.connect({
      blockAsyncConnect: true,
      url: nodeAddress.startsWith('ws') ? nodeAddress : undefined,
      strategy: ConnectStrategy.Retry,
      timeoutDuration: 2000,
      retryInterval: 1000,
    })

    const { isSynced, hasUtxoIndex, networkId } = await this.kaspa.getServerInfo()

    if (!isSynced || !hasUtxoIndex) {
      await this.kaspa.disconnect()

      throw Error('Node is not synchronized or lacks UTXO index.')
    }

    if (this.networkId !== networkId) {
      this.emit('network', networkId)
      this.networkId = networkId
    }
  }

  private registerEvents () {
    this.kaspa.addEventListener('connect', () => {
      this.emit('connection', true)
    })

    this.kaspa.addEventListener('disconnect', () => {
      this.emit('connection', false)
    })
  }
}
