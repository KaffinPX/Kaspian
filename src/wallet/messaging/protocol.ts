export interface RequestMappings {
  'wallet:import': [ string, string ] // Mnemonics + password
  'wallet:create': [ string ] // Password
  'node:change': [ string ] // Node address
}

export interface Request<Method extends keyof ResponseMappings> {
  id: number;
  method: Method;
  params: RequestMappings[Method];
}

export interface ResponseMappings {
  'wallet:import': boolean // If successfully done(Disabled(&& ignored) for now)
  'wallet:create': string // Returns mnemonics(Could be moved to frontend)
  'node:change': boolean // If successfully done
}

export interface Response<Method extends keyof RequestMappings> {
  id: number
  result: ResponseMappings[Method] | false
  error?: {
    message: string
  }
}
