import { Status } from "../core/wallet";

export interface RequestMappings {
  'wallet:status': []
}

export interface Request<M extends keyof ResponseMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface ResponseMappings {
  'wallet:status': Status
}

export interface Response<M extends keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: {
    message: string
  }
}
