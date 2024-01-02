import { IWallet } from "../../storage/LocalStorage"

interface InputDefinitions {
  "wallet:list": {}
  "wallet:create": { name: string; mnemonics?: string; password: string }
  "wallet:unlock": { id: number; password: string }
  "wallet:lock": {}
  "account:create": { name: string }
  "account:switch": { id: number }
}

interface OutputDefinitions {
  "wallet:list": IWallet[]
  "wallet:create": { id: number; mnemonics: string }
  "wallet:unlock": boolean
  "wallet:lock": void
  "account:create": { id: number }
  "account:switch": boolean
}

interface InputMessage<
  method extends keyof InputDefinitions = keyof InputDefinitions
> {
  method: method
  params: InputDefinitions[type]
}

interface OutputMessage<
  method extends keyof OutputDefinitions = keyof OutputDefinitions
> {
  method: method
  result: OutputDefinitions[type]
}
