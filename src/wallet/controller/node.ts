import { RpcClient, ConnectStrategy } from "@/../wasm"
import { EventEmitter } from "events"

export enum Connection {
  Disconnected,
  Connected
}

export default class Node extends EventEmitter {
  status: Connection = Connection.Disconnected
  kaspa: RpcClient

  constructor (nodeAddress: string) {
    super()
    
    this.kaspa = new RpcClient()

    this.reconnect(nodeAddress)
  }

  async reconnect (nodeAddress?: string) {
    return
    
    await this.kaspa.connect({
      blockAsyncConnect: true,
      url: nodeAddress,
      strategy: ConnectStrategy.Retry,
      timeoutDurationMsec: 1000,
      retryIntervalMsec: 1000
    })

    const { isSynced } = await this.kaspa.getServerInfo()

    if (!isSynced) {
      await this.kaspa.disconnect()
      this.status = Connection.Disconnected
      
      throw Error('Node is not synchronized')
    }

    this.status = Connection.Connected
  }
}
