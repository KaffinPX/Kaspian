import browser from "webextension-polyfill"
import Router from "./wallet/router"
import Notifier from "./wallet/notifier"
import type { Request } from "./protocol"
import type Wallet from "../kaspa/wallet"
import type Node from "../kaspa/node"
import type Account from "../kaspa/account"
import Api from "./wallet/api"

export default class RPC {
  api: Api
  router: Router
  notifier: Notifier
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor ({ wallet, node, account }: { 
    wallet: Wallet,
    node: Node,
    account: Account
  }) {
    this.api = new Api(account)
    this.router = new Router({ wallet, node, account, api: this.api })
    this.notifier = new Notifier({ wallet, node, account })

    this.listen()
  }

  private listen () {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()

      if (port.name === '@kaspian/provider') {
        this.api.askAccess(port)
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
      this.ports.forEach(port => {
        port.postMessage(event)
      })
    })
  }
}