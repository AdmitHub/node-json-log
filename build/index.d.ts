/// <reference types="bunyan" />
import { NodeOptions } from '@sentry/node';
declare const _default: {
    createLogger: (options?: import("bunyan").LoggerOptions) => import("./lib/logger").TracingLogger;
    installLogger: (config: NodeOptions) => void;
    tracer: import("dd-trace").Tracer;
};
export = _default;
