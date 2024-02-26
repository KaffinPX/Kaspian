import type Wallet from "../../controller/wallet"
import type Node from "../../controller/node"
import type Account from "../../controller/account"
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

  private registerListeners() {
    this.wallet.on('status', (status) => this.handleEvent('wallet:status', status))
    this.account.on('balance', (balance) => this.handleEvent('account:balance', balance))

    // this.node.on('connection', (status) => this.handleEvent('node:connection', status)) [not available yet]
  }
  
  private handleEvent <E extends keyof EventMappings>(event: E, data: EventMappings[E]) {
    if (!this.callback) return

    this.callback({ event, data })
  }
}