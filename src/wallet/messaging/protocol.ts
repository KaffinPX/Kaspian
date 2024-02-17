import { Status as WalletStatus } from "../controller/wallet"
import { Status as NodeStatus } from "../controller/node"

export interface RequestMappings {
  'wallet:status': []
  'wallet:create': [ string ] // Password
  'wallet:unlock': [ string ] // Password
  'wallet:reset': []
  'account:address': []
  'node:status': []
}

export interface Request<M extends keyof ResponseMappings = keyof ResponseMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface ResponseMappings {
  'wallet:status': WalletStatus
  'wallet:create': string
  'wallet:unlock': boolean
  'wallet:reset': boolean
  'account:address': string
  'node:status': NodeStatus
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: string
}

export interface EventMappings {
  "wallet:status": WalletStatus
}

export interface Event<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export function isEvent (message: any): message is Event {
  return message && message.event
}
