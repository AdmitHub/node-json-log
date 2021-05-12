import logger from '../src'

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
    process.env = {
      ...OLD_ENV,
      LOG_LEVEL: 'trace'
    }
    log = logger.createLogger()
    spyLogTrace = jest.spyOn(require('bunyan').prototype, 'trace')
    spyLogDebug = jest.spyOn(require('bunyan').prototype, 'debug')
    spyLogInfo = jest.spyOn(require('bunyan').prototype, 'info')
    spyLogWarn = jest.spyOn(require('bunyan').prototype, 'warn')
    spyLogError = jest.spyOn(require('bunyan').prototype, 'error')
    spyLogFatal = jest.spyOn(require('bunyan').prototype, 'error')
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = OLD_ENV
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
    process.env = {
      ...OLD_ENV,
      LOG_LEVEL: 'warn',
      LOG_SCOPES: 'info'
    }
    log = logger.createLogger()

    log.info({
      scope: 'info'
    }, 'Info Message')

    expect(spyLogInfo).not.toHaveBeenCalled()
    expect(spyLogWarn).toHaveBeenCalled()
  })

  it('ADD TEST FOR REPORT', () => {

  })
})
