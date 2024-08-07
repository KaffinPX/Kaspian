import { Status } from "../kaspa/wallet"
import { UTXO } from "../kaspa/account"
import { CustomInput, CustomSignature } from "../kaspa/account/transactions"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:import': [ string, string ] // Mnemo, Password
  'wallet:unlock': [ string ] // Password
  'wallet:export': [ string ] // Password
  'wallet:lock': []
  'wallet:reset': []
  'node:connect': [ string ]
  'node:connection': [],
  'node:submit': [ string[] ]
  'account:addresses': []
  'account:balance': []
  'account:utxos': []
  'account:create': [[ string, string ][], string, CustomInput[]? ]
  'account:sign': [ string[], string, CustomSignature[]? ]
  'account:submitContextful': [ string[] ]
  'account:scan': []
  'provider:connect': [ string ]
  'provider:connection': []
  'provider:disconnect': []
}

export interface Request<M extends keyof ResponseMappings = keyof ResponseMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface ResponseMappings {
  'wallet:status': Status
  'wallet:create': string
  'wallet:import': boolean
  'wallet:unlock': boolean
  'wallet:export': string
  'wallet:lock': boolean
  'wallet:reset': boolean
  "node:connect": boolean
  'node:connection': boolean
  'node:submit': string[]
  'account:addresses': [ string[], string[] ]
  'account:balance': number,
  'account:utxos': UTXO[]
  'account:create': string[]
  'account:sign': string[]
  'account:submitContextful': string[]
  'account:scan': boolean
  "provider:connect": boolean
  'provider:connection': string
  "provider:disconnect": boolean
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: string
}

export interface EventMappings {
  "wallet:status": Status
  "node:connection": boolean
  "node:network": string
  "account:balance": number
  "account:addresses": [ string[], string[] ]
  'provider:connection': string
}

export interface EventMessage<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export type Event<M extends keyof EventMappings = keyof EventMappings> = {
  [ K in M]: EventMessage<K>
}[ M ]

export function isEvent (message: any): message is Event {
  return message && typeof message.event === 'string' && typeof message.data !== 'undefined'
}