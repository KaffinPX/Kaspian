import Wallet from './controller/wallet'
import Node from './controller/node'
import RPC from './messaging'
import Router from './messaging/server/router'
import Notifier from './messaging/server/notifier'

import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node("wss://kaspa.aspectron.com:443/mainnet")

    const messaging = new RPC('@kaspian/client', {
      router: new Router({ wallet, node }),
      notifier: new Notifier({ wallet, node }),
    })
  })
})
