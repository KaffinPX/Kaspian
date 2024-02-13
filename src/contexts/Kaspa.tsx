import { createContext, useState, ReactNode } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { Status as WalletStatus } from "@/wallet/controller/wallet"
import { Status as NodeStatus } from "@/wallet/controller/node"

export interface IKaspa {
  status: WalletStatus
  nodeStatus: NodeStatus
}

export const defaultState: IKaspa = {
  status: WalletStatus.Uninitialized,
  nodeStatus: NodeStatus.Disconnected
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
