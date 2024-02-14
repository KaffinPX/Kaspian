import { useContext } from "react"
import { type Runtime } from "webextension-polyfill"
import { IKaspa, KaspaContext } from "../contexts/Kaspa"
import { Request, Response, ResponseMappings, RequestMappings } from "../wallet/messaging/protocol"

interface RequestCallback<M extends keyof RequestMappings> {
  success: (result: ResponseMappings[M]) => void
  error: (reason?: string) => void
}

class KaspaInterface {
  private connection: Runtime.Port
  private state: IKaspa
  private setState: React.Dispatch<React.SetStateAction<IKaspa>>

  private nonce: number = 0
  private pendingMessages: Map<number, [ RequestCallback<any>['success'], RequestCallback<any>['error'] ]> = new Map()

  constructor(connection: Runtime.Port, state: IKaspa, setState: any) {
    this.connection = connection
    this.state = state
    this.setState = setState

    this.registerListener()
  }

  get status () { 
    return this.state.status
  }

  get nodeStatus () { 
    return this.state.nodeStatus
  }

  async load () {
    const status = await this.request('wallet:status', [])
    const nodeStatus = await this.request('node:status', [])

    console.error(status, nodeStatus)

    this.setState({
      status,
      nodeStatus
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

      this.connection.postMessage(message)
    })
  }

  private registerListener () {
    const onMessageListener = (message: Response<keyof RequestMappings>) => {
      const messageCallbacks = this.pendingMessages.get(message.id)

      if (!messageCallbacks) return this.connection.onMessage.removeListener(onMessageListener)
      const [ resolve, reject ] = messageCallbacks

      this.pendingMessages.delete(message.id)

      if (message.error) return reject(message.error)
      resolve(message.result)
    }

    this.connection.onMessage.addListener(onMessageListener)
  }
}

export default function useKaspa () {
  const context = useContext(KaspaContext)
  
  if (!context) throw new Error("Missing Kaspa context")

  return new KaspaInterface(context.connection, context.state, context.setState)
}
