import { createContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react"
import { runtime } from "webextension-polyfill"
import { Status } from "@/wallet/kaspa/wallet"
import { Request, Response, Event, RequestMappings, ResponseMappings, isEvent } from "@/wallet/messaging/protocol"

export interface IKaspa {
  status: Status
  connected: boolean
  address: string
  balance: number
  utxos: [ string, string ][]
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  address: "",
  balance: 0,
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
  let nonce = -1

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
          updateState('connected', message.data)
        } else if (message.event === 'wallet:status') {
          updateState('status', message.data)
        } else if (message.event === 'account:balance') {
          updateState('balance', message.data)
        } else if (message.event === 'account:address') {
          updateState('address', message.data)
        }
      } else {
        const [ resolve, reject ] = pendingMessages.get(message.id)

        if (!message.error) { 
          resolve(message.result)
        } else {
          reject(message.error)
        }

        pendingMessages.delete(message.id)
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
