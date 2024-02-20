import { RpcClient, ConnectStrategy } from "@/../wasm"
import { EventEmitter } from "events"

export enum Status {
  Disconnected,
  Connected
}

export default class Node extends EventEmitter {
  status: Status = Status.Disconnected
  kaspa: RpcClient

  constructor (nodeAddress: string) {
    super()
    this.kaspa = new RpcClient()

    this.reconnect(nodeAddress)
  }

  async reconnect (nodeAddress?: string) {
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
      this.status = Status.Disconnected
      
      throw Error('Node is not synchronized')
    }

    this.status = Status.Connected
  }
}
