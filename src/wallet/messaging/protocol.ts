import { Status } from "../controller/wallet"
import { Connection } from "../controller/node"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:import': [ string, string ] // Mnemo, Password
  'wallet:unlock': [ string ] // Password
  'wallet:lock': []
  'wallet:reset': []
  'node:connection': []
  'account:addresses': []
  'account:balance': []
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
  'node:connection': Connection
  'account:addresses': [ string[], string[] ]
  'account:balance': string
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: string
}

export interface EventMappings {
  "wallet:status": Status
  "node:connection": Connection
  "account:balance": string
}

export interface Event<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export function isEvent (message: any): message is Event {
  return message && typeof message.event === 'string' && typeof message.data !== 'undefined'
}