import type { ProviderInfo, Request } from "./protocol"

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
    const request = (event as CustomEvent<Request<any>>).detail
    
    port.postMessage(request)
  })

  port.onDisconnect.addListener(() => {
    console.error('port disconnected wtf...')
  })
})

announceProvider()