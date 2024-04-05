import browser from "webextension-polyfill"

export default class Api {
  private port: browser.Runtime.Port | undefined

  async askAccess (port: browser.Runtime.Port) {
    this.port = port
    
    const page = await browser.windows.create({
      url: `./wallet?url=${port.sender?.url}#connect`,
      type: 'popup',
      width: 365,
      height: 592,
      focused: true
    })
  }

  grantAccess (url: string) {
    if (url !== this.port?.sender?.url) throw Error('Invalid URL granted')
    // todo...
  } 
}