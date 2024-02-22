import { createContext, useState, ReactNode } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { Status } from "@/wallet/controller/wallet"
import { Connection } from "@/wallet/controller/node"

export interface IKaspa {
  status: Status
  connection: Connection
  address: string | undefined
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connection: Connection.Disconnected,
  address: undefined
}

export const KaspaContext = createContext<{
  connection: Runtime.Port
  state: IKaspa
  setState: React.Dispatch<React.SetStateAction<IKaspa>>
} | undefined>(undefined)

export function KaspaProvider ({ children }: {
  children: ReactNode
}) {
  const connection = runtime.connect({ name: "@kaspian/client" }) 
  const [ state, setState ] = useState(defaultState)

  return (
    <KaspaContext.Provider value={{ connection, state, setState }}>
      {children}
    </KaspaContext.Provider>
  )
}
