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

      this.disconnect()
    })
  }

  connect (url: string) {
    if (!this.port) throw Error('No port found')

    this.granted = true

    this.port.onMessage.addListener((request) => this.handleMessage(request))    
    this.submitEvent(0, 'account', {
      balance: this.account.balance,
      addresses: [ this.account.addresses.receiveAddresses, this.account.addresses.changeAddresses ]
    })

    this.emit('connection', url)
  }

  disconnect () {
    if (!this.port) throw Error('Not connected')

    this.port.disconnect()
    this.granted = false
    delete this.port

    this.emit('connection', "")
  }

  private submitEvent <E extends keyof EventMappings>(
    id: number,
    event: E,
    data: EventMappings[E] | false,
    error?: number
  ) {
    if (!this.port || !this.granted) return

    const encodedEvent: Event<E> = { id, event, data, error }
    this.port.postMessage(encodedEvent)
  }

  private async handleMessage (request: Request) {
    if (request.method === 'send') {
      let transactions: string[]

      await this.windows.open('send', {
        'recipient': request.params[0],
        'amount': request.params[1]
      }, () => {
        if (transactions) {
          this.submitEvent(request.id, 'transactions', transactions)
        } else {
          this.submitEvent(request.id, 'transactions', false, 505)
        }
      })

      this.account.once('transactions', (parsedTransactions) => transactions = parsedTransactions)
    }
  }
}