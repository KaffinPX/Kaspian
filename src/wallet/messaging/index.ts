import browser from "webextension-polyfill"
import { Request, RequestMappings } from "./protocol"
import Router from "./router"

export default class RPC {
  router: Router

  constructor (router: Router) {
    this.router = router

    this.listen()
  }

  listen () {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()
      if (port.name !== '@kaspian/client') return

      const onMessageListener = async (request: Request<keyof RequestMappings>) => {
        const response = await this.router.routeMessage(request)

        port.postMessage(response)
      }

      port.onMessage.addListener(onMessageListener)
      
      port.onDisconnect.addListener(() => {
        port.onMessage.removeListener(onMessageListener)
      })
    })
  }
}