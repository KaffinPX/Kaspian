import { Request, Response, RequestMappings, ResponseMappings } from "./protocol"

import type Wallet from "../controller/wallet"
import type Node from "../controller/node"

type MappingsRecord<M extends keyof RequestMappings> = {
  [ K in M ]: (...params: RequestMappings[K]) => Promise<ResponseMappings[K]> | ResponseMappings[K]
}

export default class Router {
  wallet: Wallet
  node: Node
  mappings: MappingsRecord<keyof RequestMappings>

  constructor (wallet: Wallet, node: Node) {
    this.wallet = wallet
    this.node = node

    this.mappings = {
      'wallet:status': () => this.wallet.status,
      'wallet:create': (password: string) => this.wallet.create(password), // refactor
      'wallet:unlock': (password: string) => this.wallet.unlock(0, password),
      'wallet:reset': () => this.wallet.reset(),
      'account:address': () => this.wallet.activeAccount!.deriveReceive(),
      'node:status': () => this.node.status
    }  
  }

  async routeMessage <M extends keyof RequestMappings>(request: Request<M>) {
    let response: Response<M> = {
      id: request.id,
      result: false,
    }

    const methodHandler = this.mappings[request.method]

    try {
      response.result = await methodHandler(...request.params) // improve later by making possible to accept void and returns true by true as Response<M>["result"]
    } catch (error) {
      if (!(error instanceof Error)) return console.error('Non-standard error', error)

      console.error(error)

      response.error = error.message
    }
    
    return response
  }
}