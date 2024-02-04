import { Request, Response, RequestMappings } from "./protocol"
import type Wallet from "../core/wallet"
import type Node from "../core/node"

export default class Router {
  wallet: Wallet
  node: Node
  mappings: Record<string, Function>

  constructor (wallet: Wallet, node: Node) {
    this.wallet = wallet
    this.node = node

    this.mappings = {
      'wallet:status': () => this.wallet.status
    }
  }

  async routeMessage (request: Request<keyof RequestMappings>) {
    let response: Response<keyof RequestMappings> = {
      id: request.id,
      result: false,
      error: {
        message: "Unknown method"
      }
    }

    const methodHandler = this.mappings[request.method]
    console.log('Selected method handler:', methodHandler)
    if (methodHandler) {
      console.log('executing funct')
      delete response.error
      response.result = await methodHandler(...request.params)
      console.log('executed, new response result', response.result)
    }

    return response
  }
  
}