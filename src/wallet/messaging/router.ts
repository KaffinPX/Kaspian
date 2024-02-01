import { Request, Response, RequestMappings, isRequestOfType } from "./protocol"

import type Wallet from "../core/wallet"
import type Node from "../core/node"

export default class Router {
  wallet: Wallet
  node: Node

  constructor (wallet: Wallet, node: Node) {
    this.wallet = wallet
    this.node = node
  }

  async routeMessage (request: Request<keyof RequestMappings>) {
    let response: Response<keyof RequestMappings> = {
      id: request.id,
      result: false,
      error: {
        code: 404,
        message: "Unknown module."
      }
    }

    if (request.method.startsWith('wallet')) {
      if (isRequestOfType(request, 'wallet:create')) {
        response.result = await this.wallet.create(request.params)
      }
    } else if (request.method.startsWith('node')) {

    } else if (request.method.startsWith('account')) {

    }

    return response
  }
  
}