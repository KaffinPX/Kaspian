import Wallet from './controller/wallet'
import Node from './controller/node'
import RPC from './messaging'

import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node("wss://kaspa.aspectron.com:443/mainnet")

    const messaging = RPC.fromComponents({ wallet, node })
  })
})
