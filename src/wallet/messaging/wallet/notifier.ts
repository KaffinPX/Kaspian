import type Wallet from "../../kaspa/wallet"
import type Node from "../../kaspa/node"
import type Account from "../../kaspa/account"
import type { EventMessage, EventMappings } from "../protocol"
import Provider from "./provider"

export default class Notifications {
  callback: ((event: EventMessage) => void) | undefined

  constructor({ wallet, node, account, provider }: { 
    wallet: Wallet
    node: Node
    account: Account
    provider: Provider
  }) {
    wallet.on('status', (status) => this.handleEvent('wallet:status', status))
    account.on('balance', (balance) => this.handleEvent('account:balance', balance))
    account.on('addresses', (addresses) => this.handleEvent('account:addresses', addresses))
    node.on('connection', (status) => this.handleEvent('node:connection', status))
    provider.on('connection', (url) => this.handleEvent('provider:connection', url))
  }

  registerCallback (callback: (event: EventMessage) => void) {
    this.callback = callback
  }

  private handleEvent <E extends keyof EventMappings>(event: E, data: EventMappings[E]) {
    if (!this.callback) return

    this.callback({ event, data })
  }
}