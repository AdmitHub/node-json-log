import config from './config'
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
import * as Sentry from '@sentry/node'
import enforcedSerializers from './serializers'

export type NotFunction<T> = T extends Function ? never : T
export type LogObject<T> = {
  [key: string]: NotFunction<T>
}
export type TracingLoggerOptions = Omit<LoggerOptions, 'name'> & { sentry?: typeof Sentry, name?: string, additionalStreams?: Stream }

export class TracingLogger extends Logger {
  sentry?: typeof Sentry
  constructor(options: TracingLoggerOptions) {
    super(options as LoggerOptions)
    this.sentry = options.sentry
  }

  report<T>(obj?: LogObject<T> | Error | string, ...params: NotFunction<T>[]) {
    const data = obj
    let exception: Error
    let toLog: { [key: string]: any }
    let message: string
    let sentryMsg: string

    if (typeof data === 'string') {
      exception = new Error(data)
      toLog = {err: exception}
      message = data
    } else if (data instanceof Error) {
      exception = data
      toLog = {err: exception}
      message = exception.message
    } else if (data && typeof data === 'object') {
      if (data.err instanceof Error || data.error instanceof Error) {
        exception = (data.err || data.error) as unknown as Error
      } else {
        const error = (data.err || data.error || 'No error provided') as string
        exception = new Error(error)
      }
      toLog = { ...data, err: exception }
      message = exception.message
    } else {
      exception = new Error('Unknown data type provided')
      toLog = { err: exception }
      message = 'Unknown data type provided'
    }

    if (this.sentry) {
      this.sentry.setTag('scope', toLog.scope)
      toLog.sentry_id = this.sentry.captureException(exception)

      sentryMsg = '[Logged to Sentry]'
    } else {
      toLog.sentry_id = null
      sentryMsg = '[Skipped Sentry]'
    }

    if (message) {
      params = [message, ...params] as NotFunction<T>[]
    }

    return this.scopedLogEmitter(ERROR, toLog, ...params, sentryMsg)
  }

  trace(): boolean
  trace<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  trace<T>(obj?: LogObject<T>, ...params: NotFunction<T>[]): void | boolean {
    return this.scopedLogEmitter(TRACE, obj, ...params)
  }

  debug(): boolean
  debug<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  debug<T>(obj?: LogObject<T>, ...params: any[]): void | boolean {
    return this.scopedLogEmitter(DEBUG, obj, ...params)
  }

  info(): boolean
  info<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  info<T>(obj?: LogObject<T>, ...params: NotFunction<T>[]): void | boolean {
    return this.scopedLogEmitter(INFO, obj, ...params)
  }

  warn(): boolean
  warn<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  warn<T>(obj?: LogObject<T>, ...params: NotFunction<T>[]): void | boolean {
    return this.scopedLogEmitter(WARN, obj, ...params)
  }

  error(): boolean
  error<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  error<T>(obj?: LogObject<T>, ...params: NotFunction<T>[]): void | boolean {
    return this.scopedLogEmitter(ERROR, obj, ...params)
  }

  fatal(): boolean
  fatal<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void
  fatal<T>(obj?: LogObject<T>, ...params: any[]): void | boolean {
    return this.scopedLogEmitter(FATAL, obj, ...params)
  }

  scopedLogEmitter<T>(logLevel: number, obj: LogObject<T> | Error | undefined, ...params: any[]): void {
    const currentEnabledLevel: number = super.level()
    const isLogInScope: boolean = this._isLogInScope(obj)
    let level: number = logLevel

    if (isLogInScope && level < currentEnabledLevel) {
      level = currentEnabledLevel // Forcibly promote to a higher log level we know will pass the level logic checks
    }

    const levelName: LogLevelString = nameFromLevel[level] as LogLevelString

    super[levelName](obj, ...params)
  }

  _isLogInScope(data: any) {
    if (typeof data !== 'object') {
      return false
    }

    const tag = data.scope || ''

    return config.logScopes.some(scope => tag.includes(scope))
  }
}

const createLogger = (options: TracingLoggerOptions = {}): TracingLogger => {
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

  let serializers = {...stdSerializers, ...enforcedSerializers}

  if (options.serializers) {
    serializers = {...serializers, ...options.serializers}
  }

  const defaultOptions: LoggerOptions = {
    level: config.logLevel as (LogLevel | undefined),
    serializers,
    src: false,
    streams,
    name: os.hostname().split('-cmd')[0],
    sentry: options.sentry
  }

  return new TracingLogger(defaultOptions)
}

export { createLogger }
