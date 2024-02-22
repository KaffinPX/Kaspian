import Wallet, { Status } from './controller/wallet'
import Node from './controller/node'
import Account from './controller/account'
import RPC from './messaging'

import load from "@/../wasm"

load().then(() => {
  const wallet = new Wallet(() => {
    const node = new Node("wss://kaspa.aspectron.com:443/mainnet")
    const account = new Account()

    if (wallet.status === Status.Unlocked) {
      account.import()
    }

    wallet.on('status', () => {
      if (wallet.status === Status.Unlocked) {
        account.import()
      }
    })

    const messaging = RPC.fromComponents({ wallet, node, account })
  })
})
