export interface ProviderInfo {
  id: string
  name: string
}

export interface AccountData {
  balance: number
  addresses: [ string[], string[] ]
}

export interface RequestMappings {
  'send': [ string, string ]
}

export interface Request<M extends keyof RequestMappings = keyof RequestMappings> {
  method: M
  params: RequestMappings[M]
}

export interface EventMappings {
  'account': AccountData,
  'transaction': string
}

export interface Event<M extends keyof EventMappings = keyof EventMappings> {
  event: M,
  data: EventMappings[M]
}