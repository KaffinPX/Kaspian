import Wallet from './core/wallet'
import Node from './core/node'
import RPC from './messaging'

import load from "../../wasm"

load().then(() => {
  const wallet = new Wallet() // TODO: ready callbacks like on node?

  const node = new Node('wss://kaspa.aspectron.com:443/mainnet', async () => {
    console.log('Connected!')
  })


})
