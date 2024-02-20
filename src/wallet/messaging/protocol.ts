import { Status } from "../controller/wallet"
import { Connection } from "../controller/node"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:import': [ string, string ] // Mnemo, Password
  'wallet:unlock': [ string ] // Password
  'wallet:reset': []
  'account:address': []
  'node:connection': []
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
  'wallet:reset': boolean
  'account:address': string
  'node:connection': Connection
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: string
}

export interface EventMappings {
  "node:connection": Connection
}

export interface Event<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export function isEvent (message: any): message is Event {
  return message && message.event && message.data
}
