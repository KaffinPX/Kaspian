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

export function isRequest (object: any): object is Request {
  if (typeof object !== 'object') return false

  if (typeof object.method !== 'string' || !Array.isArray(object.params)) {
    return false
  }

  switch (object.method) {
    case 'send':
      return object.params.length === 2 &&
             typeof object.params[0] === 'string' &&
             typeof object.params[1] === 'string'
    default:
      return false
  }
}

export interface EventMappings {
  'account': AccountData,
  'transaction': string
}

export interface Event<M extends keyof EventMappings = keyof EventMappings> {
  event: M,
  data: EventMappings[M]
}