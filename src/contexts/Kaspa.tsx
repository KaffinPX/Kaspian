import { createContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { Status } from "@/wallet/kaspa/wallet"
import { Request, Response, Event, RequestMappings, ResponseMappings, isEvent } from "@/wallet/messaging/protocol"

export interface IKaspa {
  status: Status
  connected: boolean
  address: string
  balance: string
  utxos: [ string, string ][]
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  address: "",
  balance: '0 KAS',
  utxos: []
}

export const KaspaContext = createContext<{
  load: () => Promise<void>
  kaspa: IKaspa
  request: <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => Promise<ResponseMappings[M]>
} | undefined>(undefined)

export function KaspaProvider ({ children }: {
  children: ReactNode
}) {
  const connection = useMemo(() => runtime.connect({ name: "@kaspian/client" }), [])
  const [ kaspa, setState ] = useState(defaultState)

  const pendingMessages = new Map()
  let nonce = 0

  const request = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    const message: Request<M> = {
      id: nonce += 1,
      method,
      params: params
    }

    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      pendingMessages.set(message.id, [ resolve, reject ])

      connection.postMessage(message)
    })
  }, [])

  const load = useCallback(async () => {
    const status = await request('wallet:status', [])
    const connected = await request('node:connection', [])
    const addresses = await request('account:addresses', [])
    const balance = await request('account:balance', [])
    const utxos = await request('account:utxos', [])

    const address = addresses[0][addresses[0].length - 1]

    setState({
      status,
      connected,
      address,
      balance,
      utxos
    })
  }, [])
  
  const updateState = useCallback(<K extends keyof IKaspa>(key: K, value: IKaspa[K]) => {
    setState((prevState) => ({ 
      ...prevState, 
      [ key ]: value 
    }))
  }, [])

  useEffect(() => {
    connection.onMessage.addListener((message: Event | Response) => {
      if (isEvent(message)) {
        if (message.event === 'node:connection') {
          updateState('connected', message.data as boolean)
        } else if (message.event === 'wallet:status') {
          updateState('status', message.data as Status)
        } else if (message.event === 'account:balance') {
          updateState('balance', message.data as string)
        } else if (message.event === 'account:address') {
          updateState('address', message.data as string)
        }
      } else {
        const pendingMessage = pendingMessages.get(message.id)
  
        if (!pendingMessage) return

        const [ resolve, reject ] = pendingMessage
        pendingMessages.delete(message.id)
  
        if (message.error) return reject(message.error)
        resolve(message.result)
      }
    })

    return () => {
      connection.disconnect()
    }
  }, [])


  return (
    <KaspaContext.Provider value={{ load, kaspa, request }}>
      {children}
    </KaspaContext.Provider>
  )
}
