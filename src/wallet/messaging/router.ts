import { Request, Response, RequestMappings, ResponseMappings } from "./protocol"

import type Wallet from "../controller/wallet"
import type Node from "../controller/node"

type MappingsRecord<M extends keyof RequestMappings> = {
  [ K in M ]: (...params: RequestMappings[M]) => Promise<ResponseMappings[M]> | ResponseMappings[M]
}

export default class Router {
  wallet: Wallet
  node: Node
  mappings: MappingsRecord<keyof RequestMappings> = {
    'wallet:status': () => this.wallet.status,
    'node:status': () => this.node.status
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
      try {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/57322
        response.result = await methodHandler(...request.params)
      } catch (error) {
        if (!(error instanceof Error)) return console.error('Non-standard error', error)

        response.error = { 
          message: error.message
        }
      }
    } else {
      response.error = {
        message: 'Unknown method'
      }
    }

    return response
  }
}