import { useContext, useEffect } from "react"
import { type Runtime } from "webextension-polyfill"
import { IKaspa, KaspaContext } from "../contexts/Kaspa"
import { Event, Request, Response, ResponseMappings, RequestMappings, isEvent } from "../wallet/messaging/protocol"
import { Status } from "@/wallet/kaspa/wallet"

interface RequestCallback<M extends keyof RequestMappings> {
  success: (result: ResponseMappings[M]) => void
  error: (reason?: string) => void
}

class KaspaInterface {
  private port: Runtime.Port
  private state: IKaspa
  private setState: React.Dispatch<React.SetStateAction<IKaspa>>

  private nonce: number = 0
  private pendingMessages: Map<number, [ RequestCallback<any>['success'], RequestCallback<any>['error'] ]> = new Map()
  private listener: ((message: Event | Response) => void) | undefined

  constructor(port: Runtime.Port, state: IKaspa, setState: any) {
    this.port = port
    this.state = state
    this.setState = setState

    this.registerListener()
  }

  get status () { return this.state.status }
  get connection () { return this.state.connection }
  get address () { return this.state.address }
  get balance () { return this.state.balance }
  get utxos () { return this.state.utxos }
  
  async load () {
    const status = await this.request('wallet:status', [])
    const connection = await this.request('node:connection', [])
    const addresses = await this.request('account:addresses', [])
    const balance = await this.request('account:balance', [])
    const utxos = await this.request('account:utxos', [])

    const address = addresses[0][addresses[0].length - 1]

    this.setState({
      status,
      connection,
      address,
      balance,
      utxos
    })
  }

  async request <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) {
    const message: Request<M> = {
      id: this.nonce += 1,
      method,
      params: params
    }

    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      this.pendingMessages.set(message.id, [ resolve, reject ])

      this.port.postMessage(message)
    })
  }

  unregisterListener () {
    this.port.onMessage.removeListener(this.listener!)
  }

  private registerListener () {
    this.listener = (message: Event | Response) => {
      if (isEvent(message)) {
        console.error(`${message.event} event received`, message)
        console.error('is registered', this.port.onMessage.hasListener(this.listener!))
        
        if (message.event === 'wallet:status') {
          this.updateState('status', message.data as Status)
        } else if (message.event === 'account:balance') {
          this.updateState('balance', message.data as string)
        } else if (message.event === 'account:address') {
          this.updateState('address', message.data as string)
        }
      } else {
        const pendingMessage = this.pendingMessages.get(message.id)
  
        if (!pendingMessage) return

        const [ resolve, reject ] = pendingMessage
        this.pendingMessages.delete(message.id)
  
        if (message.error) return reject(message.error)
        resolve(message.result)
      }
    }

    this.port.onMessage.addListener(this.listener)
  }

  private updateState <K extends keyof IKaspa>(key: K, value: IKaspa[K]) {
    this.setState({
      ...this.state,
      [ key ]: value
    })
  }
}

export default function useKaspa () {
  const context = useContext(KaspaContext)

  if (!context) throw new Error("Missing Kaspa context")

  const hook = new KaspaInterface(context.connection, context.state, context.setState)
  
  useEffect(() => {
    return () => {
      console.log('unregistering listener ')
      hook.unregisterListener()
    }
  }, [])
  
  return hook
}
