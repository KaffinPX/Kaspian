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

    const { id } = await browser.windows.create({
      url: `./?${queryParams}#${hash}`,
      type: 'popup',
      width: 365,
      height: 592,
      focused: true
    })

    if (callback) this.windows.set(id!, callback)

    return id!
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