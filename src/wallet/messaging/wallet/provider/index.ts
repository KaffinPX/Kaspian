import browser from "webextension-polyfill"
import type { Request } from "@/provider/protocol"
import Account from "@/wallet/kaspa/account"
import { EventEmitter } from "events"

export default class Provider extends EventEmitter {
  account: Account
  private port: browser.Runtime.Port | undefined

  constructor (account: Account) {
    super()

    this.account = account
  }

  get connectedURL () {
    return this.port?.sender?.url ?? ""
  }

  async askAccess (port: browser.Runtime.Port) {
    if (this.port) return port.disconnect()
  
    this.port = port
    
    await browser.windows.create({
      url: `./?url=${port.sender?.url}#connect`,
      type: 'popup',
      width: 365,
      height: 592,
      focused: true
    })

    this.port.onDisconnect.addListener(() => {
      delete this.port
    })
  }

  connect (url: string) {
    if (!this.port) throw Error('No any pending ports found')
    if (url !== this.port.sender?.url) throw Error('Invalid URL granted')

    const onMessageListener = (request: Request) => {
      // TODO: Dont trust calls

      this.handleMessage(request)
    }

    this.port.onMessage.addListener(onMessageListener)

    this.port.onDisconnect.addListener(() => {
      this.port!.onMessage.removeListener(onMessageListener)

      this.emit('connection', false)
    })

    this.port.postMessage({
      event: 'account',
      data: {
        balance: this.account.balance,
        addresses: this.account.addresses
      }
    })

    this.emit('connection', true)
  }

  disconnect () {
    if (!this.port) throw Error('No any ports found')

    this.port.disconnect()
    this.emit('connection', false)

    delete this.port
  }

  private async handleMessage (request: Request) {
    if (request.method === 'send') {
      await browser.windows.create({
        url: `./?recipient=${request.params[0]}&amount=${request.params[1]}#send`,
        type: 'popup',
        width: 365,
        height: 592,
        focused: true
      })

      // TODO: notifications...
    }
  }
}