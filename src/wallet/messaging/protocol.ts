export interface Request<Method extends keyof ResponseMappings> {
  id: number;
  method: Method;
  params: RequestMappings[Method];
}

export interface RequestMappings {
  'wallet:import': string // Mnemonics(TODO: add password(&& ignored for now))
  'wallet:create': string // Password
  'node:change': string // Node address
}

export interface Response<Method extends keyof RequestMappings> {
  id: number
  result: ResponseMappings[Method]
  error?: {
    code: number
    message: string
  }
}

interface ResponseMappings {
  'wallet:import': boolean // If successfully done(Disabled(&& ignored) for now)
  'wallet:create': string // Returns mnemonics(Could be moved to frontend)
  'node:change': boolean // If successfully done
}

export function isRequestOfType<Method extends keyof RequestMappings>(
  request: Request<any>,
  method: Method
): request is Request<Method> {
  return request.method === method;
}
