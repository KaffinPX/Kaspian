import browser from "webextension-polyfill"

export default class Api {
  private port: browser.Runtime.Port | undefined

  async askAccess (port: browser.Runtime.Port) {
    if (this.port) return port.disconnect()
    
    this.port = port
    
    const page = await browser.windows.create({
      url: `./index.html?grant...`,
      type: 'popup',
      focused: true,
    })
  }

  // TODO: rejection

  grantAccess (url: string) {
    if (url !== this.port?.sender?.url) throw Error('Invalid URL granted')
    // todo...
  } 
}