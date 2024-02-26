import type Wallet from "../../controller/wallet"
import type Node from "../../controller/node"
import type Account from "../../controller/account"
import type { Request, Response, RequestMappings, ResponseMappings } from "../protocol"

type MappingsRecord<M extends keyof RequestMappings = keyof RequestMappings> = {
  [ K in M ]: (...params: RequestMappings[K]) => ResponseMappings[K] extends boolean ? void : (Promise<ResponseMappings[K]> | ResponseMappings[K])
}

export default class Router {
  wallet: Wallet
  node: Node
  account: Account
  mappings: MappingsRecord

  constructor ({ wallet, node, account }: { 
    wallet: Wallet,
    node: Node,
    account: Account
  }) {
    this.wallet = wallet
    this.node = node
    this.account = account

    this.mappings = {
      'wallet:status': () => this.wallet.status,
      'wallet:create': (password: string) => this.wallet.create(password),
      'wallet:import': (mnemonic: string, password: string) => this.wallet.import(mnemonic, password),
      'wallet:unlock': (password: string) => this.wallet.unlock(0, password),
      'wallet:lock': () => this.wallet.lock(),
      'wallet:reset': () => this.wallet.reset(),
      'node:connection': () => this.node.status,
      'account:addresses': () => this.account.addresses,
      'account:balance': () => this.account.balance
    }  
  }

  async routeMessage <M extends keyof RequestMappings>(request: Request<M>) {
    let response: Response<M> = {
      id: request.id,
      result: false,
    }

    const methodHandler = this.mappings[request.method]

    try {
      response.result = (await methodHandler(...request.params) ?? true) as ResponseMappings[M]
    } catch (error) {
      if (!(error instanceof Error)) return console.error('Non-standard error', error)

      console.error(error) // Temporary

      response.error = error.message
    }
    
    return response
  }
}