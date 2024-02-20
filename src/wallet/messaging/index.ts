import browser from "webextension-polyfill"
import Router from "./server/router"
import { type Request } from "./protocol"
import type Wallet from "../controller/wallet"
import type Node from "../controller/node"
import Notifier from "./server/notifier"

export default class RPC {
  router: Router | undefined
  notifier: Notifier | undefined
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor (identity: string) {
    this.listen(identity)
  }

  registerModules ({ wallet, node }: {
    wallet: Wallet,
    node: Node
  }) {
    this.router = new Router(wallet, node)
    this.notifier = new Notifier({ wallet, node })
  }

  private listen (identity: string) {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()
      if (port.name !== identity) return

      this.registerPort(port)
    })
  }

  private registerPort (port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request) => {
      const response = await this.router!.routeMessage(request)

      port.postMessage(response)
    }

    port.onMessage.addListener(onMessageListener)

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(onMessageListener)

      this.ports.delete(port)
    })
  }
}