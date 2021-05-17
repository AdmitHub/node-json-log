import tracer from './lib/tracer'
import { createLogger } from './lib/logger'
import { installRaven } from './lib/raven-initializer'
import { NodeOptions } from '@sentry/node'

export = {
  createLogger,
  installLogger: (config: NodeOptions) => {
    installRaven(config)
  },
  tracer
}
