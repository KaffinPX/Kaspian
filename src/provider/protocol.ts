export interface ProviderInfo {
  id: string
  name: string
}

export interface AccountInfo {
  balance: number
  addresses: [ string[], string[] ]
}

export interface CustomInput {
  address: string
  outpoint: string
  index: number,
  signer: string
  script?: string
}

export interface RequestMappings {
  'transact': [[ string, string ][], string?, CustomInput[]?] // outputs, fee, custom
}

export interface Request<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export function isRequest (object: any): object is Request {
  if (typeof object !== 'object') return false

  if (typeof object.id !== 'number' || typeof object.method !== 'string' || !Array.isArray(object.params)) {
    return false
  }

  switch (object.method) {
    case 'transact': {
      if (object.params.length !== 3) return false

      for (const output of object.params[0]) {
        if (typeof output[0] !== 'string' || typeof output[1] !== 'string') return false
      }
      
      if (typeof object.params[1] !== 'string') return false

      // TODO: Custom input check

      return true
    }
    default:
      return false
  }
}

export interface EventMappings {
  'account': AccountInfo,
  'transact': string[]
}

export interface EventMessage<M extends keyof EventMappings = keyof EventMappings> {
  id: number
  event: M
  data: EventMappings[M] | false
  error?: number
}

export type Event<M extends keyof EventMappings = keyof EventMappings> = {
  [ K in M]: EventMessage<K>
}[ M ]