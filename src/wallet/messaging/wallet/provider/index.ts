import browser from "webextension-polyfill"
import type { Request, Event, EventMappings } from "@/provider/protocol"
import Windows from "@/wallet/messaging/wallet/provider/windows"
import Account from "@/wallet/kaspa/account"
import { EventEmitter } from "events"

export default class Provider extends EventEmitter {
  private windows: Windows
  private account: Account
  private port: browser.Runtime.Port | undefined
  private granted: boolean = false

  constructor (account: Account) {
    super()

    this.windows = new Windows()
    this.account = account

    this.account.on('transaction', (hash) => this.handleEvent('transaction', hash))
  }
  
  get connectedURL () {
    return this.granted ? this.port?.sender?.url : ""
  }

  async askAccess (port: browser.Runtime.Port) {
    if (this.port) return port.disconnect()

    this.port = port

    const id = await this.windows.open('connect', {
      url: port.sender!.url!
    }, () => {
      if (this.granted) return

      this.port!.disconnect()
      delete this.port
    })

    this.port.onDisconnect.addListener(() => {
      browser.windows.remove(id)
    })
  }

  connect (url: string) {
    if (!this.port) throw Error('No port found')

    this.granted = true

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
    if (!this.port || !this.granted) return

    this.port.postMessage({ event, data })
  }

  private async handleMessage (request: Request) {
    if (request.method === 'send') {
      await this.windows.open('send', {
        'recipient': request.params[0],
        'amount': request.params[1]
      })
    }
  }
}