import { RpcClient, Encoding } from "@/../wasm"

export default class Node {
  kaspa: RpcClient

  constructor (nodeAddress: string, readyCallback: Function) {
    this.kaspa = new RpcClient(nodeAddress, Encoding.Borsh)

    this.reconnect().then(() => readyCallback())
  }

  async reconnect (nodeAddress?: string) {
    // @ts-ignore
    await this.kaspa.connect()
  }
}