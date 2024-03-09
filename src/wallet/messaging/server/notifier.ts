import type Wallet from "../../kaspa/wallet"
import type Node from "../../kaspa/node"
import type Account from "../../kaspa/account"
import type { Event, EventMappings } from "../protocol"

export default class Notifications {
  wallet: Wallet
  node: Node
  account: Account
  callback: ((event: Event) => void) | undefined

  constructor({ wallet, node, account }: { 
    wallet: Wallet
    node: Node
    account: Account
  }) {
    this.wallet = wallet
    this.node = node
    this.account = account

    this.registerListeners()
  }

  registerCallback(callback: (event: Event) => void) {
    this.callback = callback
  }

  private handleEvent <E extends keyof EventMappings>(event: E, data: EventMappings[E]) {
    if (!this.callback) return

    this.callback({ event, data })
  }
  
  private registerListeners() {
    this.wallet.on('status', (status) => this.handleEvent('wallet:status', status))
    this.account.on('balance', (balance) => this.handleEvent('account:balance', balance))
    this.account.on('address', (address) => this.handleEvent('account:address', address))
    // this.node.on('connection', (status) => this.handleEvent('node:connection', status)) [not available yet]
  }
}