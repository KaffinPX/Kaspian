import { RpcClient, ConnectStrategy } from "@/../wasm"
import { EventEmitter } from "events"


export default class Node extends EventEmitter {
  kaspa: RpcClient

  constructor () {
    super()
    
    this.kaspa = new RpcClient()
    
    this.registerEvents()
  }

  get connected () {
    return this.kaspa.isConnected
  }

  async reconnect (nodeAddress: string) {
    await this.kaspa.disconnect()
    await this.kaspa.connect({
      blockAsyncConnect: true,
      url: nodeAddress,
      strategy: ConnectStrategy.Retry,
      timeoutDuration: 2000,
      retryInterval: 1000,
    })

    const { isSynced } = await this.kaspa.getServerInfo()

    if (!isSynced) {
      await this.kaspa.disconnect()

      throw Error('Node is not synchronized')
    }
  }

  private registerEvents () {
    this.kaspa.addEventListener('open', () => {
      this.emit('connection', true)
    })

    this.kaspa.addEventListener('close', () => {
      this.emit('connection', false)
    })
  }
}
