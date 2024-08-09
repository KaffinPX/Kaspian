import browser from "webextension-polyfill"
import Router from "./wallet/router"
import Notifier from "./wallet/notifier"
import type { Request } from "./protocol"
import type Wallet from "../kaspa/wallet"
import type Node from "../kaspa/node"
import type Account from "../kaspa/account"
import Provider from "./wallet/provider"

export default class RPC {
  provider: Provider
  notifier: Notifier
  router: Router
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor ({ wallet, node, account }: { 
    wallet: Wallet,
    node: Node,
    account: Account
  }) {
    this.provider = new Provider(account)
    this.notifier = new Notifier({ wallet, node, account, provider: this.provider })
    this.router = new Router({ wallet, node, account, provider: this.provider })

    this.listen()
  }

  private listen () {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()

      if (port.name === '@kaspian/provider') {
        this.provider.askAccess(port)
      } else if (port.name === '@kaspian/client') {
        this.permitPort(port)
      }
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
      for (const port of this.ports) {
        port.postMessage(event)
      }
    })
  }
}