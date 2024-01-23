interface ProviderInfo {
  name: string
}

function announceProvider() {
  const info: ProviderInfo = {
    name: "Kaspian"
  }

  window.dispatchEvent(new CustomEvent("kaspa:provider", {
    detail: Object.freeze({ info }),
  }))
}

window.addEventListener("kaspa:requestProviders", () => {
  announceProvider()
})

announceProvider()