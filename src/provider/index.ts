import type { ProviderInfo } from "./protocol"

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

window.addEventListener('kaspa:connect', () => {
  // TODO: check if detail of event has our extension id
  
  chrome.runtime.connect({
    name: '@kaspian/provider'
  })
})

announceProvider()