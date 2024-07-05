import browser from "webextension-polyfill"

export default class Windows {
  windows: Map<number, () => void> = new Map()

  constructor () {
    this.registerListener()
  }

  async open (hash: string, params: { [ key: string ]: string }, callback?: () => void) {
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    const location = await this.calculateLocation()
    const { id } = await browser.windows.create({
      url: `./?${queryParams}#${hash}`,
      top: location[0],
      left: location[1],
      type: 'popup',
      width: 365,
      height: 600, // TODO: find a way to remove this...
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
    browser.windows.onRemoved.addListener((id) => {
      const callback = this.windows.get(id)
      if (!callback) return

      callback()

      this.windows.delete(id)
    })
  }
}