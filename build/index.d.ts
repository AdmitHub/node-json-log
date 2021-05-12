/// <reference types="bunyan" />
import { ConstructorOptions } from 'raven';
declare const _default: {
    log: import("./lib/logger").TracingLogger;
    createLogger: (options?: import("bunyan").LoggerOptions) => import("./lib/logger").TracingLogger;
    installLogger: (config: ConstructorOptions) => void;
};
export = _default;
