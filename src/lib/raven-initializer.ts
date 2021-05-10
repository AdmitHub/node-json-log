import Raven, { ConstructorOptions } from 'raven'
import config from './config'
import { createLogger } from './logger'

const logger = createLogger()

function installRaven(_config: ConstructorOptions = {}) {
  Raven.config(config.sentryUrl, {
    extra: {
      level: config.logLevel
    },
    ..._config
  }).install()

  Raven.install((err, sendErr, eventId) => {
    if (!sendErr) {
      logger.error({
        err,
        eventId,
        scope: 'node-json-log.raven.sent-fatal'
      }, `Successfully sent fatal error with eventId ${eventId} to Sentry:`)
    }

    logger.error({
      err,
      scope: 'node-json-log.raven.failed-send'
    }, 'Sentry caught an unhandled error and it never made it to sentry :(')
    process.exit(1)
  })

  config.ravenWasInstalled = true
}

export { installRaven }
