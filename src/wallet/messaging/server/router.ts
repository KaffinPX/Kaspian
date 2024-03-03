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
      'wallet:create': (password) => this.wallet.create(password),
      'wallet:import': (mnemonic, password) => this.wallet.import(mnemonic, password),
      'wallet:unlock': (password) => this.wallet.unlock(0, password),
      'wallet:lock': () => this.wallet.lock(),
      'wallet:reset': () => this.wallet.reset(),
      'node:connection': () => this.node.status,
      'node:connect': (address) => this.node.reconnect(address),
      'account:addresses': () => this.account.addresses,
      'account:balance': () => this.account.balance,
      'account:utxos': () => this.account.utxos,
      'account:initiateSend': (recipient, amount) => this.account.initiateSend(recipient, amount),
      'account:signPendings': (password) => this.account.signPendings(password),
      'account:submitSigned': () => this.account.submitSigned()
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
      if (typeof error === 'string') {
        response.error = error
      } else if (error instanceof Error) {
        response.error = error.message
      }
    }
    
    return response
  }
}