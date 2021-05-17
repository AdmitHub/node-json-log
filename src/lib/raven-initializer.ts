import  * as Raven from '@sentry/node'
import config from './config'
import { createLogger } from './logger'

const logger = createLogger()

function installRaven(
    _config: Raven.NodeOptions = {}
  ) {
  try {
    Raven.init(_config)
    logger.info({
      scope: 'node-json-log.raven.init-success'
    }, 'Sentry init successful')
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
