import { isRequest, type ProviderInfo, type Request } from "./protocol"

function announceProvider () {
  const info: ProviderInfo = {
    id: chrome.runtime.id,
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
  
  if (chrome.runtime.id !== extensionId) return
  
  const port = chrome.runtime.connect({
    name: '@kaspian/provider'
  })

  port.onMessage.addListener((message) => {
    window.dispatchEvent(new CustomEvent("kaspa:event", {
      detail: Object.freeze(message),
    }))
  })

  window.addEventListener('kaspa:invoke', (event) => {
    const request = (event as CustomEvent).detail
    if (!isRequest(request)) return
  
    port.postMessage(request)
  })

  port.onDisconnect.addListener(() => {
    window.dispatchEvent(new CustomEvent("kaspa:disconnect"))
  })
})

announceProvider()