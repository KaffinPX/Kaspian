import { createContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react"
import { runtime } from "webextension-polyfill"
import { Status } from "@/wallet/kaspa/wallet"
import { Request, Response, Event, RequestMappings, ResponseMappings, isEvent } from "@/wallet/messaging/protocol"
import { UTXO } from "@/wallet/kaspa/account"

export interface IKaspa {
  status: Status
  connected: boolean
  addresses: [ string[], string[] ]
  balance: number
  utxos: UTXO[]
  connectedURL: string
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  addresses: [ [], [] ],
  balance: 0,
  utxos: [],
  connectedURL: "" 
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

  const awaitingMessages = new Map()
  let nonce = -1

  const request = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    const message: Request<M> = {
      id: nonce += 1,
      method,
      params: params
    }

    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      awaitingMessages.set(message.id, [ resolve, reject ])

      connection.postMessage(message)
    })
  }, [])

  const load = useCallback(async () => {
    setState({
      status: await request('wallet:status', []),
      connected: await request('node:connection', []),
      balance: await request('account:balance', []),
      utxos: await request('account:utxos', []),
      addresses: await request('account:addresses', []),
      connectedURL: await request('provider:connectedURL', [])
    })
  }, [])
  
  const updateState = useCallback(<K extends keyof IKaspa>(key: K, value: IKaspa[K]) => {
    setState((prevState) => ({ 
      ...prevState, 
      [ key ]: value 
    }))
  }, [])

  useEffect(() => {
    connection.onMessage.addListener(async (message: Event | Response) => {
      if (isEvent(message)) {
        if (message.event === 'node:connection') {
          updateState('connected', message.data)
        } else if (message.event === 'wallet:status') {
          updateState('status', message.data)
        } else if (message.event === 'account:balance') {
          updateState('balance', message.data)
          updateState('utxos', await request('account:utxos', []))
        } else if (message.event === 'account:address') {
          updateState('addresses', await request('account:addresses', []))
        } if (message.event === 'provider:connection') {
          updateState('connectedURL', message.data)
        }
      } else {
        const [ resolve, reject ] = awaitingMessages.get(message.id)

        if (!message.error) { 
          resolve(message.result)
        } else {
          reject(message.error)
        }

        awaitingMessages.delete(message.id)
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
