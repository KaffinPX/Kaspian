import { createContext, useState, ReactNode, useCallback, useRef } from "react"
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

export function KaspaProvider ({ children }: {
  children: ReactNode
}) {
  const [ kaspa, setState ] = useState(defaultState)

  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

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
            updateState('addresses', await request('account:addresses', []))
            updateState('connected', message.data)
            break
          case 'node:network':
            updateState('addresses', await request('account:addresses', []))
            break
          case 'wallet:status':
            updateState('status', message.data)
            break
          case 'account:balance':
            updateState('balance', message.data);
            updateState('utxos', await request('account:utxos', []))
            break
          case 'account:addresses':
            updateState('addresses', (addresses) => [
              addresses[0].concat(message.data[0]),
              addresses[1].concat(message.data[1]),
            ])
            break
          case 'provider:connection':
            updateState('provider', message.data)
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
  }, [])

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

  const load = useCallback(async () => {
    setState({
      status: await request('wallet:status', []),
      connected: await request('node:connection', []),
      balance: await request('account:balance', []),
      utxos: await request('account:utxos', []),
      addresses: await request('account:addresses', []),
      provider: await request('provider:connection', [])
    })
  }, [])
  
  const updateState = useCallback(<K extends keyof IKaspa>(key: K, value: IKaspa[K] | ((prevState: IKaspa[K]) => IKaspa[K])) => {
    setState((prevState) => ({
      ...prevState,
      [ key ]: typeof value === 'function' ? value(prevState[key]) : value
    }))
  }, [])
  
  return (
    <KaspaContext.Provider value={{ load, kaspa, request }}>
      {children}
    </KaspaContext.Provider>
  )
}
