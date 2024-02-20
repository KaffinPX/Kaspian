import browser from "webextension-polyfill"
import Router from "./server/router"
import Notifier from "./server/notifier"
import type { Request } from "./protocol"
import type Wallet from "../controller/wallet"
import type Node from "../controller/node"

export default class RPC {
  router: Router
  notifier: Notifier
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor ({ router, notifier }: {
    router: Router
    notifier: Notifier
  }) {
    this.router = router
    this.notifier = notifier

    this.listen()
  }

  static fromComponents ({ wallet, node }: { 
    wallet: Wallet,
    node: Node
  }) {
    return new RPC({
      router: new Router({ wallet, node }),
      notifier: new Notifier({ wallet, node }),
    })
  }

  private listen () {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()
      if (port.name !== '@kaspian/client') return

      this.permitPort(port)
    })

    this.streamEvents()
  }

  private permitPort (port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request) => {
      const response = await this.router.routeMessage(request)

      port.postMessage(response)
    }

    port.onMessage.addListener(onMessageListener)

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(onMessageListener)

      this.ports.delete(port)
    })
  }

  private streamEvents () {
    this.notifier.registerCallback((event) => {
      this.ports.forEach(port => {
        port.postMessage(event)
      })
    })
  }
}