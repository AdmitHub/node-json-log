import Raven, { NodeOptions } from '@sentry/node'
import config from './config'
import { createLogger } from './logger'

const logger = createLogger()

function installRaven(
    _config: NodeOptions = {}
  ) {
  try {
    Raven.init(_config)
    logger.info({
      scope: 'node-json-log.raven.init-success'
    }, 'Sentry caught an unhandled error and it never made it to sentry :(')
  } catch (err) {
    logger.error({
      err,
      scope: 'node-json-log.raven.init-failed'
    }, 'Sentry caught an unhandled error and it never made it to sentry :(')
    process.exit(1)
  }

  config.ravenWasInstalled = true
}

export { installRaven }
