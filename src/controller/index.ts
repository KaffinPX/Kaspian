import Store from "./store"
import browser from "webextension-polyfill"

browser.runtime.onMessage
class Controller {
  store: Store

  constructor() {
    this.store = new Store(() => this.listen())
  }

  listen() {
    chrome.runtime.onConnect.addListener(port => {
      port.onMessage.addListener(async (message: InputMessage) => {
        const { method, params } = message
        let output = {} as OutputMessage<typeof method>

        switch (method) {
          case "wallet:create":
            output.result = await wallet.create(
              params.name,
              params.password,
              params.mnemonics
            )
            break
        }

        port.postMessage(output)
      })
    })
  }
}

new Controller()
