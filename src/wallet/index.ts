import Wallet from './controller/wallet'
import Node from './controller/node'
import RPC from './messaging'
import Router from './messaging/router'

import { defaultSettings } from '@/contexts/Settings'
import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node(defaultSettings.nodes[0].address)
  
    new RPC(new Router(wallet, node))
  })
})
