import { RpcClient, Encoding, NetworkType } from "../../../wasm/kaspa_wasm"

export default class Node {
  rpc: RpcClient
  networkType: string = ""

  constructor(nodeAddress: string, readyCallback: Function) {
    this.rpc = new RpcClient(Encoding.Borsh, nodeAddress)

    this.rpc.connect().then(async () => {
      const nodeInfo = await this.rpc.getInfo()
      if (nodeInfo.isSynced === false) throw Error("Node is not synchronized.")

      const networkInfo = await this.rpc.getBlockDagInfo()
      this.networkType = NetworkType[networkInfo.network.networkType]

      readyCallback()
    })
  }
}
