import browser from "webextension-polyfill"

export default class Api {
  connected: boolean = false
  private port: browser.Runtime.Port | undefined

  async askAccess (port: browser.Runtime.Port) {
    if (this.connected) throw Error('Please disconnect other instance first')
    
    this.port = port
    
    await browser.windows.create({
      url: `./wallet?url=${port.sender?.url}#connect`,
      type: 'popup',
      width: 365,
      height: 592,
      focused: true
    })
  }

  grantAccess (url: string) {
    if (!this.port) throw Error('No any pending ports found')
    if (url !== this.port.sender?.url) throw Error('Invalid URL granted')

    const onMessageListener = async (request: any) => {
      this.port!.postMessage("wip")
    }

    this.port.onMessage.addListener(onMessageListener)

    this.port.onDisconnect.addListener(() => {
      this.port!.onMessage.removeListener(onMessageListener)
      this.connected = false
    })
  } 
}