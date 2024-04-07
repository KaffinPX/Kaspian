import browser from "webextension-polyfill"
import type { Request } from "@/provider/protocol"
import Account from "@/wallet/kaspa/account"

export default class Api {
  account: Account
  connected = false
  private port: browser.Runtime.Port | undefined

  constructor (account: Account) {
    this.account = account
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

    const onMessageListener = async (request: Request) => {
      // TODO: Dont trust calls

      this.handleCall(request)
    }

    this.port.onMessage.addListener(onMessageListener)

    this.port.onDisconnect.addListener(() => {
      this.port!.onMessage.removeListener(onMessageListener)

      this.connected = false
    })

    this.port.postMessage({
      event: 'account',
      data: {
        balance: this.account.balance,
        addresses: this.account.addresses
      }
    })
  }

  disconnect () {
    if (!this.port) throw Error('No any ports found')

    this.port.disconnect()
    this.connected = false

    delete this.port
  }

  private async handleCall (call: Request) {
    if (call.method === 'send') {
      await browser.windows.create({
        url: `./?recipient=${call.params[0]}&amount=${call.params[1]}#send`,
        type: 'popup',
        width: 365,
        height: 592,
        focused: true
      })

      // TODO: notifications...
    }
  }
}