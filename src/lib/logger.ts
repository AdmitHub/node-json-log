import Logger, {
  TRACE,
  INFO,
  DEBUG,
  WARN,
  ERROR,
  FATAL,
  nameFromLevel,
  stdSerializers,
  LoggerOptions,
  LogLevel,
  Stream,
  LogLevelString,
} from 'bunyan'
import os from 'os'
import config from './config'
import Raven, { CaptureOptions } from 'raven'
import enforcedSerializers from './serializers'
import tracer from 'dd-trace'

class TracingLogger extends Logger {
  report(...args: any[]) {
    const data = args[0]
    let exception: Error
    let toLog: {[key: string]: any}
    let message: string
    let sentryMsg: string

    if (typeof data === 'string') {
      exception = new Error(data)
      toLog = { err: exception }
      message = data
    } else if (data instanceof Error) {
      exception = data
      toLog = { err: exception }
      message = exception.message
    } else if (data && typeof data === 'object') {
      if(data.err instanceof Error || data.error instanceof Error) {
        exception = data.err || data.error
      } else {
        exception = new Error(data.err || data.error || 'No error provided')
      }
      toLog = { ...data, err: exception }
      message = args[1] || exception.message
    } else {
      exception = new Error('Unknown data type provided')
      toLog = { err: exception }
      message = 'Unknown data type provided'
    }

    if (config.ravenWasInstalled) {
      const sentryObject: CaptureOptions = {
        tags: {
          scope: toLog.scope
        }
      }

      toLog.sentry_id = Raven.captureException(exception, sentryObject)

      sentryMsg = '[Logged to Sentry]'
    } else {
      toLog.sentry_id = null
      sentryMsg = '[Skipped Sentry]'
    }

    if (message) {
      args = [message, ...args]
    }

    return this.scopedLogEmitter(ERROR, toLog, ...args, sentryMsg)
  }

  // @ts-ignore
  trace(...args: any[]): void {
    return this.scopedLogEmitter(TRACE, ...args)
  }
  // @ts-ignore
  debug(...args: any[]): void {
    return this.scopedLogEmitter(DEBUG, ...args)
  }
  // @ts-ignore
  info(...args: any[]): void {
    return this.scopedLogEmitter(INFO, ...args)
  }
  // @ts-ignore
  warn(...args: any[]): void {
    return this.scopedLogEmitter(WARN, ...args)
  }
  // @ts-ignore
  error(...args: any[]): void {
    return this.scopedLogEmitter(ERROR, ...args)
  }
  // @ts-ignore
  fatal(...args: any[]): void {
    return this.scopedLogEmitter(FATAL, ...args)
  }

  scopedLogEmitter(logLevel: number, ...args: any[]): void {
    const currentEnabledLevel: number = super.level()
    const isLogInScope: boolean = this._isLogInScope(args[0])
    let level: number = logLevel

    if (isLogInScope && level < currentEnabledLevel) {
      level = currentEnabledLevel // Forcibly promote to a higher log level we know will pass the level logic checks
    }

    const levelName: LogLevelString = nameFromLevel[level] as LogLevelString

    // @ts-ignore
    super[levelName](...args)
  }

  _isLogInScope(data: any) {
    if (typeof data !== 'object') {
      return false
    }

    const tag = data.scope || ''

    return config.logScopes.some(scope => tag.includes(scope))
  }
}

const createLogger = (options: LoggerOptions = { name: '' }) => {
  const streams: Stream[] = [
    {
      level: config.logLevel as LogLevel,
      stream: process.stdout
    }
  ]

  if (options.additionalStreams) {
    streams.push({
      level: config.logLevel as LogLevel,
      stream: options.additionalStreams
    })
  }

  let serializers = { ...stdSerializers, ...enforcedSerializers }

  if (options.serializers) {
    serializers = { ...serializers, ...options.serializers }
  }

  const defaultOptions: LoggerOptions = {
    level: config.logLevel as (LogLevel | undefined),
    serializers,
    src: false,
    streams,
    name: os.hostname().split('-cmd')[0]
  }

  const logger = new TracingLogger(defaultOptions)

  if (config.tracingEnabled) {
    tracer.init({
      logInjection: true
    })
  }

  return logger
}

export { createLogger }
