import { RpcClient, ConnectStrategy } from "@/../wasm"
import { EventEmitter } from "events"

export enum Connection {
  Disconnected,
  Connected
}

export default class Node extends EventEmitter {
  status: Connection = Connection.Disconnected
  kaspa: RpcClient

  constructor () {
    super()
    
    this.kaspa = new RpcClient()
  }

  async reconnect (nodeAddress: string) {
    if (this.kaspa.isConnected) await this.kaspa.disconnect()
    await this.kaspa.connect({
      blockAsyncConnect: true,
      url: nodeAddress,
      strategy: ConnectStrategy.Retry,
      timeoutDuration: 1000,
      retryInterval: 1000
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
