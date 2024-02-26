import Wallet, { Status } from './controller/wallet'
import Node from './controller/node'
import Account from './controller/account'
import RPC from './messaging'

import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node("wss://eu-1.kaspa-ng.io/mainnet")
    const account = new Account(node)

    const messaging = RPC.fromComponents({ wallet, node, account })
  })
})
