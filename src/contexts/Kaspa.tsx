import { createContext, useReducer, ReactNode, useCallback, useRef } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { Status } from "@/wallet/kaspa/wallet"
import { Request, Response, Event, RequestMappings, ResponseMappings, isEvent } from "@/wallet/messaging/protocol"
import { UTXO } from "@/wallet/kaspa/account"

export interface IKaspa {
  status: Status
  connected: boolean
  addresses: [ string[], string[] ]
  balance: number
  utxos: UTXO[]
  provider: string
}

interface MessageEntry<M extends keyof RequestMappings> {
  resolve: (value: ResponseMappings[M]) => void;
  reject: (reason?: any) => void;
  message: Request<M>;
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  addresses: [[], []],
  balance: 0,
  utxos: [],
  provider: "" 
}

export const KaspaContext = createContext<{
  load: () => Promise<void>
  kaspa: IKaspa
  request: <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => Promise<ResponseMappings[M]>
} | undefined>(undefined)

type Action<K extends keyof IKaspa> = {
  type: K;
  payload: IKaspa[K] | ((oldState: IKaspa) => IKaspa[K])
}

function kaspaReducer (state: IKaspa, action: Action<keyof IKaspa>): IKaspa {
  const { type, payload } = action

  if (typeof payload === 'function') {
    return { ...state, [ type ]: payload(state) }
  } else {
    return { ...state, [ type ]: payload }
  }
}

export function KaspaProvider ({ children }: { children: ReactNode }) {
  const [ kaspa, dispatch ] = useReducer(kaspaReducer, defaultState)

  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

  const request = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    const message: Request<M> = {
      id: ++nonceRef.current,
      method,
      params
    }

    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      messagesRef.current.set(message.id, { resolve, reject, message })

      getConnection().postMessage(message)
    })
  }, [])

  const getConnection = useCallback(() => {
    if (connectionRef.current) return connectionRef.current
  
    const connection = runtime.connect({ name: "@kaspian/client" })

    connection.onMessage.addListener(async (message: Response | Event) => {
      if (!isEvent(message)) {
        const { resolve, reject } = messagesRef.current.get(message.id)!

        if (!message.error) { 
          resolve(message.result)
        } else {
          reject(message.error)
        }

        messagesRef.current.delete(message.id)
      } else {
        switch (message.event) {
          case 'node:connection':
            dispatch({ type: 'addresses', payload: await request('account:addresses', []) })
            dispatch({ type: 'connected', payload: message.data })
            break
          case 'node:network':
            dispatch({ type: 'addresses', payload: await request('account:addresses', []) })
            break
          case 'wallet:status':
            dispatch({ type: 'status', payload: message.data })
            break
          case 'account:balance':
            dispatch({ type: 'balance', payload: message.data })
            dispatch({ type: 'utxos', payload: await request('account:utxos', []) })
            break
          case 'account:addresses':
            dispatch({
              type: 'addresses',
              payload: ({ addresses }) => [
                addresses[0].concat(message.data[0]),
                addresses[1].concat(message.data[1]),
              ],
            })
            break
          case 'provider:connection':
            dispatch({ type: 'provider', payload: message.data })
            break
        }
      }
    })

    connection.onDisconnect.addListener(() => {
      if (runtime.lastError?.message !== 'Could not establish connection. Receiving end does not exist.') return

      connectionRef.current = null

      for (const entry of messagesRef.current.values()) {
        getConnection().postMessage(entry.message)
      }
    })

    connectionRef.current = connection

    return connection
  }, [ kaspa.addresses ])

  const load = useCallback(async () => {
    dispatch({ type: 'status', payload: await request('wallet:status', []) })
    dispatch({ type: 'connected', payload: await request('node:connection', []) })
    dispatch({ type: 'balance', payload: await request('account:balance', []) })
    dispatch({ type: 'utxos', payload: await request('account:utxos', []) })
    dispatch({ type: 'addresses', payload: await request('account:addresses', []) })
    dispatch({ type: 'provider', payload: await request('provider:connection', []) })
  }, [])
  
  return (
    <KaspaContext.Provider value={{ load, kaspa, request }}>
      {children}
    </KaspaContext.Provider>
  )
}
