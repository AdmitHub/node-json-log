import bunyan from 'bunyan'
import config from './config'
import { IncomingMessage, ServerResponse } from 'http'

type BuiltRequest = {
  protocol: string
  hostname: string
  port: number | string
  path: string
  method: string
  query: string
  remote_ip: string
  remote_port: string | number
  user_agent: string
  cookies?: { [key: string]: any }
  headers?: { [key: string]: any }
  body?: { [key: string]: any } | string
}

type BuiltResponse = {
  headers?: { [key: string]: any }
  status?: string | number
  type?: string
}

const parseCookies = (headers: { [key: string]: any }) => {
  try {
    return headers.cookie
      .split(';')
      .map((unsplit: string) => unsplit.split('='))
      .reduce((cookies: { [key: string]: any }, unparsed: any[]) => {
        cookies[unparsed[0]] = unparsed[1]
        return cookies
      }, {})
  } catch (e) {
    return `[parse error] ${e}`
  }
}

export = {
  request: function customReq(req: any) {
    const builtRequest: BuiltRequest = {
      protocol: req.secure ? 'HTTPS' : 'HTTP',
      hostname: req.host,
      port: req.connection.localPort,
      path: (req.originalUrl || req.url).split('?')[0],
      method: req.method,

      query: req.query,

      remote_ip: req.connection.remoteAddress,
      remote_port: req.connection.remotePort,
      user_agent: req.headers['user-agent'],
    }

    if (config.logCookies && req.headers.cookie) {
      builtRequest.cookies = parseCookies(req.headers)
    }

    if (config.logHeaders) {
      builtRequest.headers = { ...req.headers }
      delete builtRequest.headers?.cookie
    }

    if (config.logBody && req.body) {
      if (
        config.logBodyLimit === 0 ||
        JSON.stringify(req.body).length < config.logBodyLimit
      ) {
        builtRequest.body = req.body
      } else {
        builtRequest.body = '[truncated]'
      }
    }

    return builtRequest
  },
  response: function customRes(res: any): BuiltResponse {
    // request lib returns an http.IncomingMessage object for it's response
    // express returns an http.ServerResponse for it's response
    // This might also be the actual response data, in which case, just log it

    let data: BuiltResponse = {}

    if (res instanceof IncomingMessage) {
      // This is coming from request. There should potentially be an error in here
      // if (res.statusCode >= 400) {
      //  data.body = res.data || res.body
      // }
      data.status = res.statusCode
      data.type = 'IncomingMessage'
    } else if (res instanceof ServerResponse) {
      if (config.logHeaders) {
        data.headers = res.getHeaders()
      }

      data.status = res.statusCode
      data.type = 'ServerResponse'
    } else {
      data = { ...data, type: 'Object' }
    }

    return data
  },
  level: function customLevel(level: number): string {
    return bunyan.nameFromLevel[level]
  },
  error: bunyan.stdSerializers.err
}
