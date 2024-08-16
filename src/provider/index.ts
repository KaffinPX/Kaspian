import browser from "webextension-polyfill"
import { isRequest, type ProviderInfo } from "./protocol"

function announceProvider () {
  const info: ProviderInfo = {
    id: browser.runtime.id,
    name: "Kaspian"
  }

  window.dispatchEvent(new CustomEvent("kaspa:provider", {
    detail: Object.freeze(info),
  }))
}

window.addEventListener('kaspa:requestProviders', () => {
  announceProvider()
})

window.addEventListener('kaspa:connect', (event) => {
  const extensionId = (event as CustomEvent<string>).detail
  if (browser.runtime.id !== extensionId) return
  
  const port = browser.runtime.connect({
    name: '@kaspian/provider'
  })

  port.onMessage.addListener((message) => {
    window.dispatchEvent(new CustomEvent("kaspa:event", {
      detail: Object.freeze(message),
    }))
  })

  const invokeListener = (event: Event) => {
    const request = (event as CustomEvent).detail
    if (!isRequest(request)) return

    port.postMessage(request)
  }

  window.addEventListener('kaspa:invoke', invokeListener)
  window.addEventListener('kaspa:disconnect', () => port.disconnect(), { once: true })

  port.onDisconnect.addListener(() => {
    window.removeEventListener('kaspa:invoke', invokeListener)
    window.dispatchEvent(new CustomEvent("kaspa:disconnect"))
  })
})

announceProvider()