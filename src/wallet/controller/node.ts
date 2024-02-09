import { RpcClient, Encoding } from "@/../wasm"

export enum Status {
  Disconnected,
  Connected
}

export default class Node {
  status: Status = Status.Disconnected
  kaspa: RpcClient

  constructor (nodeAddress: string) {
    this.kaspa = new RpcClient(nodeAddress, Encoding.Borsh)

    this.reconnect()
  }

  async reconnect (nodeAddress?: string) {
    await this.kaspa.connect({ url: nodeAddress ?? this.kaspa.url })

    const { isSynced } = await this.kaspa.getServerInfo()

    if (!isSynced) {
      await this.kaspa.disconnect()
      this.status = Status.Disconnected
      
      throw Error('Node is not synchronized')
    }

    this.status = Status.Connected
  }
}
