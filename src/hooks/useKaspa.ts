import { useContext } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { IKaspa, KaspaContext } from "../contexts/Kaspa"
import { Request, Response, RequestMappings } from "../wallet/messaging/protocol"

class KaspaInterface {
  private connection: Runtime.Port
  private state: IKaspa
  private setState: React.Dispatch<React.SetStateAction<IKaspa>>

  private nonce: number = 0
  private pendingMessages: Map<number, [ Function, Function ]> = new Map()

  constructor(connection: Runtime.Port ,state: IKaspa, setState: any) {
    this.connection = connection
    this.state = state
    this.setState = setState
  }

  get status () {
    return this.state.status
  }

  async synchronize () {
    // todo: call for telemetry on backend
  }

  async request <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) {
    const message: Request<M> = {
      id: this.nonce += 1,
      method,
      params
    }

    return new Promise((resolve, reject) => {
      this.pendingMessages.set(message.id, [ resolve, reject ])

      this.connection.postMessage(message)
    })
  }

  async registerListener () {
    this.connection.onMessage.addListener((message: Response<keyof RequestMappings>) => {
      const pendingMessage = this.pendingMessages.get(message.id)
      if (!pendingMessage) throw Error('Invalid pending message id')

      const [ resolve, reject ] = pendingMessage

      if (message.error) reject(message.error.message)

      resolve(message.result)
    })
  }
}

export default function useKaspa () {
  const context = useContext(KaspaContext)
  
  if (!context) throw new Error("Missing Kaspa context")

  if (!context.connection) { 
    context.connection = runtime.connect() // synchronous -- could be slow?
  }

  return new KaspaInterface(context.connection, context.state, context.setState)
}
