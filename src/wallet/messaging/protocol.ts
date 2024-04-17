import { Status } from "../kaspa/wallet"
import { Utxo, Summary } from "../kaspa/account"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:import': [ string, string ] // Mnemo, Password
  'wallet:unlock': [ string ] // Password
  'wallet:export': [ string ] // Password
  'wallet:lock': []
  'wallet:reset': []
  'node:connection': []
  'node:connect': [ string ]
  'account:addresses': []
  'account:balance': []
  'account:utxos': []
  'account:createSend': [ string, string ]
  'account:sign': [ string[], string ]
  'account:submit': [ string[] ]
  'provider:connect': [ string ]
  'provider:connectedURL': []
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
  'node:connection': boolean
  "node:connect": boolean
  'account:addresses': [ string[], string[] ]
  'account:balance': number,
  'account:utxos': Utxo[]
  'account:createSend': string[]
  'account:sign': string[]
  'account:submit': string[]
  "provider:connect": boolean
  'provider:connectedURL': string
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
  "account:balance": number
  "account:address": string
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