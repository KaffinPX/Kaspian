import browser from "webextension-polyfill"
import type { Request } from "@/provider/protocol"
import Account from "@/wallet/kaspa/account"
import { EventEmitter } from "events"

export default class Provider extends EventEmitter {
  account: Account
  private ports: Map<string, browser.Runtime.Port> = new Map()
  private connection: browser.Runtime.Port | undefined

  constructor (account: Account) {
    super()

    this.account = account
  }

  get connectedURL () {
    return this.connection?.sender?.url ?? ""
  }

  async askAccess (port: browser.Runtime.Port) {
    if (this.connection) return port.disconnect()
    if (this.ports.get(port.sender!.url!)) return port.disconnect()

    this.ports.set(port.sender!.url!, port)
  
    await this.openPopup('connect', {
      url: port.sender!.url!
    })

    port.onDisconnect.addListener(() => {
      if (this.ports.get(port.sender!.url!) !== port) return console.error('Sanity violation happened, looks like this was needed anyway')

      this.ports.delete(port.sender!.url!)
    })
  }

  connect (url: string) {
    if (this.connection) throw Error('Already connected')
    if (!this.ports.get(url)) throw Error('No port found')

    this.connection = this.ports.get(url)!
    
    const onMessageListener = (request: Request) => {
      // TODO: Dont trust calls

      this.handleMessage(request)
    }

    this.connection.onMessage.addListener(onMessageListener)

    this.connection.onDisconnect.addListener(() => {
      this.connection!.onMessage.removeListener(onMessageListener)
    })

    this.connection.postMessage({
      event: 'account',
      data: {
        balance: this.account.balance,
        addresses: this.account.addresses
      }
    })

    this.emit('connection', url)
  }

  disconnect () {
    if (!this.connection) throw Error('Not connected')

    this.connection.disconnect()
    this.emit('connection', "")

    delete this.connection
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
}