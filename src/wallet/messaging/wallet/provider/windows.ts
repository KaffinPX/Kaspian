import browser from "webextension-polyfill"

export default class Windows {
  windows: Map<number, () => void> = new Map()

  constructor () {
    this.registerListener()
  }

  check (id: number) {
    return this.windows.has(id)
  }

  async open (hash: string, params: {[ key: string ]: string | undefined}, callback?: () => void) {
    const queryParams = Object.entries(params)
      .filter(([, value ]) => value !== undefined)
      .map(([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`)
      .join('&')

    const location = await this.calculateLocation()
    const { id } = await browser.windows.create({
      url: `./index.html?${queryParams}#${hash}`,
      top: location[0],
      left: location[1],
      type: 'popup',
      width: 340,
      height: 548,
      focused: true
    })

    if (callback) this.windows.set(id!, callback)

    return id!
  }

  private async calculateLocation () {
    const currentWindow = await browser.windows.getCurrent()
    
    return [
      currentWindow.top! + 80,
      currentWindow.left! + currentWindow.width! - 390
    ]
  }

  private registerListener () {
    browser.windows.onRemoved.addListener((windowId) => {
      const callback = this.windows.get(windowId)
      if (!callback) return

      callback()

      this.windows.delete(windowId)
    })

    browser.windows.onFocusChanged.addListener((windowId) => {
      for (const id of this.windows.keys()) {
        // if (windowId !== id) browser.windows.remove(id)
      }
    })
  }
}