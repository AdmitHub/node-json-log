import { TracingLoggerOptions } from '../src/lib/logger'

describe('TracingLogger', () => {
  const OLD_ENV = process.env
  let spyLogTrace: jest.SpyInstance
  let spyLogDebug: jest.SpyInstance
  let spyLogInfo: jest.SpyInstance
  let spyLogWarn: jest.SpyInstance
  let spyLogError: jest.SpyInstance
  let spyLogFatal: jest.SpyInstance
  let log: any

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...OLD_ENV,
      LOG_LEVEL: 'trace'
    }
    const logger = require('../src')
    log = logger.createLogger()
    spyLogTrace = jest.spyOn(require('bunyan').prototype, 'trace')
    spyLogDebug = jest.spyOn(require('bunyan').prototype, 'debug')
    spyLogInfo = jest.spyOn(require('bunyan').prototype, 'info')
    spyLogWarn = jest.spyOn(require('bunyan').prototype, 'warn')
    spyLogError = jest.spyOn(require('bunyan').prototype, 'error')
    spyLogFatal = jest.spyOn(require('bunyan').prototype, 'fatal')
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV }
  });

  it('expect trace level log to be called', () => {
    log.trace({
      scope: 'trace'
    }, 'Trace Message')
    expect(spyLogTrace).toHaveBeenCalled()
  })

  it('expect debug level log to be called', () => {
    log.debug({
      scope: 'debug'
    }, 'Debug Message')
    expect(spyLogDebug).toHaveBeenCalled()
  })

  it('expect info level log to be called', () => {
    log.info({
      scope: 'info'
    }, 'Info Message')
    expect(spyLogInfo).toHaveBeenCalled()
  })

  it('expect warn level log to be called', () => {
    log.warn({
      scope: 'warn'
    }, 'Warn Message')
    expect(spyLogWarn).toHaveBeenCalled()
  })

  it('expect error level log to be called', () => {
    log.error({
      scope: 'error'
    }, 'Error Message')
    expect(spyLogError).toHaveBeenCalled()
  })

  it('expect fatal level log to be called', () => {
    log.fatal({
      scope: 'fatal'
    }, 'Fatal Message')
    expect(spyLogFatal).toHaveBeenCalled()
  })

  it('expect log to be promoted to higher log level if scope is in log scopes', () => {
    jest.resetModules()
    process.env = {
      ...OLD_ENV,
      LOG_LEVEL: 'warn',
      LOG_SCOPES: 'scoped.log'
    }
    spyLogInfo = jest.spyOn(require('bunyan').prototype, 'info')
    spyLogWarn = jest.spyOn(require('bunyan').prototype, 'warn')
    const logger = require('../src')
    log = logger.createLogger()

    log.info({
      scope: 'scoped.log'
    }, 'Promoted Scoped Log')

    expect(spyLogInfo).not.toHaveBeenCalled()
    expect(spyLogWarn).toHaveBeenCalled()
  })

  it('expect report to log error and report to sentry', () => {
    jest.resetModules()
    spyLogError = jest.spyOn(require('bunyan').prototype, 'error')
    const captureExceptionMock = jest.fn();
    const setTagMock = jest.fn();


    const logger = require('../src')
    log = logger.createLogger({
      sentry: {
        captureException: captureExceptionMock,
        setTag: setTagMock
      } as any
    } as TracingLoggerOptions)

    log.report({
      scope: 'call.failed'
    }, 'Reported Log')

    expect(spyLogError).toHaveBeenCalled()
    expect(captureExceptionMock.mock.calls.length).toBe(1);
    expect(setTagMock.mock.calls.length).toBe(1);
  })
})
