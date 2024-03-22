import { Status } from "../kaspa/wallet"
import { Summary } from "../kaspa/account"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:import': [ string, string ] // Mnemo, Password
  'wallet:unlock': [ string ] // Password
  'wallet:lock': []
  'wallet:reset': []
  'node:connection': []
  'node:connect': [ string ]
  'account:addresses': []
  'account:balance': []
  'account:utxos': []
  'account:initiateSend': [ string, string ]
  'account:signPendings': [ string ]
  'account:submitSigned': []

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
  'wallet:lock': boolean
  'wallet:reset': boolean
  'node:connection': boolean
  "node:connect": boolean
  'account:addresses': [ string[], string[] ]
  'account:balance': string,
  'account:utxos': [ string, string ][]
  'account:initiateSend': Summary
  'account:signPendings': boolean
  'account:submitSigned': boolean
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: string
}

export interface EventMappings {
  "wallet:status": Status
  "node:connection": boolean
  "account:balance": string
  "account:address": string
}

interface EventInterface<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export type Event<M extends keyof EventMappings = keyof EventMappings> = {
  [ K in M] : EventInterface<K>
}[ M ]

export function isEvent (message: any): message is Event {
  return message && typeof message.event === 'string' && typeof message.data !== 'undefined'
}