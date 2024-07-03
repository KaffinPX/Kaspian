import browser from "webextension-polyfill"
import type { Request, Event, EventMappings } from "@/provider/protocol"
import Account from "@/wallet/kaspa/account"
import { EventEmitter } from "events"

export default class Provider extends EventEmitter {
  private account: Account
  private port: browser.Runtime.Port | undefined
  private windowId: number | undefined

  constructor (account: Account) {
    super()

    this.account = account
    this.account.on('transaction', (hash) => this.handleEvent('transaction', hash))

    this.registerWindow()
  }
  
  get connectedURL () {
    return this.windowId ? "" : this.port?.sender?.url
  }

  async askAccess (port: browser.Runtime.Port) {
    if (this.port) return port.disconnect()

    this.port = port

    const id = await this.openPopup('connect', {
      url: port.sender!.url!
    })
    this.windowId = id

    this.port.onDisconnect.addListener(() => {
      if (!this.windowId) return

      browser.windows.remove(this.windowId)
    })
  }

  connect (url: string) {
    if (!this.port) throw Error('No port found')

    delete this.windowId

    this.port.onMessage.addListener((request) => this.handleMessage(request))    
    this.port.postMessage({
      event: 'account',
      data: {
        balance: this.account.balance,
        addresses: this.account.addresses
      }
    })

    this.emit('connection', url)
  }

  disconnect () {
    if (!this.port) throw Error('Not connected')

    this.port.disconnect()
    delete this.port
  
    this.emit('connection', "")
  }

  private handleEvent <E extends keyof EventMappings>(event: E, data: EventMappings[E]) {
    if (!this.port || this.windowId) return

    this.port.postMessage({ event, data })
  }

  private async handleMessage (request: Request) {
    if (request.method === 'send') {
      await this.openPopup('send', {
        'recipient': request.params[0],
        'amount': request.params[1]
      })
    }
  }

  private async openPopup (hash: string, params: { [ key: string ]: string }) {
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

    return id
  }

  private registerWindow () {
    browser.windows.onRemoved.addListener((id) => {
      if (id !== this.windowId) return

      this.port!.disconnect()

      delete this.windowId
      delete this.port
    })
  }
}