import tracer from './lib/tracer'
import { createLogger } from './lib/logger'
import { installRaven } from './lib/raven-initializer'
import { ConstructorOptions } from 'raven'

export = {
  createLogger,
  installLogger: (config: ConstructorOptions) => {
    installRaven(config)
  },
  tracer
}
