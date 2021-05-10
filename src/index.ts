import { createLogger } from './lib/logger'
import { installRaven } from './lib/raven-initializer'
import { ConstructorOptions } from 'raven'

export = {
  log: createLogger(),
  createLogger,
  installLogger: (config: ConstructorOptions) => {
    installRaven(config)
  }
}
