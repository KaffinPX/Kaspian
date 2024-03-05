import Wallet, { Status } from './kaspa/wallet'
import Node from './kaspa/node'
import Account from './kaspa/account'
import RPC from './messaging'

import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node()
    const account = new Account(node)

    const messaging = RPC.fromComponents({ wallet, node, account })
  })
})
