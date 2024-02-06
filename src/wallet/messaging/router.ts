import { Request, Response, RequestMappings } from "./protocol"
import type Wallet from "../core/wallet"
import type Node from "../core/node"

export default class Router {
  wallet: Wallet
  node: Node
  mappings: Record<keyof RequestMappings, Function> = { // TODO: Improve Function typing
    'wallet:status': () => this.wallet.status
  }

  constructor (wallet: Wallet, node: Node) {
    this.wallet = wallet
    this.node = node
  }

  async routeMessage <M extends keyof RequestMappings>(request: Request<M>) {
    let response: Response<M> = {
      id: request.id,
      result: false,
    }

    const methodHandler = this.mappings[request.method]

    if (methodHandler) {
      response.result = await methodHandler(...request.params)
    } else {
      response.error = {
        message: 'Unknown method'
      }
    }

    return response
  }
}