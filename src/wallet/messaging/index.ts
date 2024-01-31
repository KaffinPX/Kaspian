import browser from "webextension-polyfill"
import { Request } from "./protocol"
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

      port.onMessage.addListener(async (request: Request<any>) => {
        port.postMessage(await this.router.routeMessage(request))
      })
    })
  }
}