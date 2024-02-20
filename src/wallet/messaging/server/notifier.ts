import type Wallet from "../../controller/wallet"
import type Node from "../../controller/node"
import { type Event, EventMappings } from "../protocol"

export default class Notifications {
  wallet: Wallet
  node: Node
  callback: ((event: Event) => void) | undefined

  constructor ({ wallet, node }: { 
    wallet: Wallet,
    node: Node
  }) {
    this.wallet = wallet
    this.node = node
    
    this.registerListeners()
  }

  registerCallback (flow: (event: Event) => void) {
    this.callback = flow
  }

  private registerListeners () {
    this.node.on('connection', (status: EventMappings['node:connection']) => {
      if (!this.callback) return

      this.callback({ 
        event: 'node:connection',
        data: status
      })
    })
  }
}