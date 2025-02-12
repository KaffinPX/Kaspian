import type Wallet from "../../kaspa/wallet"
import type Node from "../../kaspa/node"
import type Account from "../../kaspa/account"
import type { EventMessage, EventMappings } from "../protocol"
import Provider from "./provider"

export default class Notifications { // TBD: maybe move provider events handling here and isolate provider access to Account
  private callback: ((event: EventMessage) => void) | undefined

  constructor({ wallet, node, account, provider }: { 
    wallet: Wallet
    node: Node
    account: Account
    provider: Provider
  }) {
    wallet.on('status', (status) => this.handleEvent('wallet:status', status))
    node.on('connection', (status) => this.handleEvent('node:connection', status))
    node.on('network', (networkId) => this.handleEvent('node:network', networkId))
    account.on('balance', (balance) => this.handleEvent('account:balance', balance))
    account['addresses'].on('addresses', (addresses) => this.handleEvent('account:addresses', addresses))
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