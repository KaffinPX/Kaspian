import browser from "webextension-polyfill"
import type { Request } from "@/provider/protocol"
import Account from "@/wallet/kaspa/account"
import { EventEmitter } from "events"

export default class Provider extends EventEmitter {
  account: Account
  private port: browser.Runtime.Port | undefined
  private connected = false

  constructor (account: Account) {
    super()

    this.account = account
  }

  get connectedURL () {
    return this.connected ? this.port!.sender!.url! : ""
  }

  async askAccess (port: browser.Runtime.Port) {
    if (this.connected) return port.disconnect()
  
    if (this.port) this.port.disconnect()
    this.port = port
    
    await this.openPopup('connect', {
      url: port.sender!.url!
    })

    this.port.onDisconnect.addListener(() => {
      delete this.port // may be problematic w multiple popups
    })
  }

  connect (url: string) {
    if (!this.port) throw Error('No port found')
    if (url !== this.port.sender?.url) throw Error('Invalid URL granted')
    if (this.connected) throw Error('Already connected')

    const onMessageListener = (request: Request) => {
      // TODO: Dont trust calls

      this.handleMessage(request)
    }

    this.port.onMessage.addListener(onMessageListener)

    this.port.onDisconnect.addListener(() => {
      this.port!.onMessage.removeListener(onMessageListener)

      this.updateConnection(false)
    })

    this.port.postMessage({
      event: 'account',
      data: {
        balance: this.account.balance,
        addresses: this.account.addresses
      }
    })

    this.updateConnection(true)
  }

  disconnect () {
    if (!this.connected) throw Error('No port found')

    this.port!.disconnect()
    this.updateConnection(false)

    delete this.port
  }

  private async handleMessage (request: Request) {
    if (request.method === 'send') {
      await this.openPopup('send', {
        'recipient': request.params[0],
        'amount': request.params[1]
      })

      // TODO: notifications...
    }
  }

  private async openPopup (hash: string, params: { [ key: string ]: string }) {
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    await browser.windows.create({
      url: `./?${queryParams}#${hash}`,
      type: 'popup',
      width: 365,
      height: 592,
      focused: true
    })
  }

  private updateConnection (connected: boolean) {
    this.connected = connected
    this.emit('connection', connected)
  }
}