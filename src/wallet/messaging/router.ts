import { Request, Response, RequestMappings, isRequestOfType } from "./protocol"

export default class Router {
  constructor () {

  }

  async routeMessage (request: Request<keyof RequestMappings>) {
    let response: Response<keyof RequestMappings> = {
      id: request.id,
      result: false,
      error: {
        code: 404,
        message: "Unknown module."
      }
    }

    if (request.method.startsWith('wallet')) {
    
    } else if (request.method.startsWith('node')) {

    } else if (request.method.startsWith('account')) {

    }

    return response
  }
}