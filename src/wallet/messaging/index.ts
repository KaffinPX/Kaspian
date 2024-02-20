import browser from "webextension-polyfill"
import Router from "./server/router"
import Notifier from "./server/notifier"
import type { Request } from "./protocol"

export default class RPC {
  router: Router
  notifier: Notifier
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor (identity: string, { router, notifier }: {
    router: Router
    notifier: Notifier
  }) {
    this.router = router
    this.notifier = notifier

    this.listen(identity)
  }

  private listen (identity: string) {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()
      if (port.name !== identity) return

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