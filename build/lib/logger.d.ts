import Logger, { LoggerOptions } from 'bunyan';
export declare class TracingLogger extends Logger {
    report(obj?: {
        [key: string]: any;
    } | string, ...params: any[]): void;
    trace(): boolean;
    trace(error: Error | any, ...params: any[]): void;
    debug(): boolean;
    debug(error: Error | any, ...params: any[]): void;
    info(error: Error | any, ...params: any[]): void;
    info(): boolean;
    warn(): boolean;
    warn(error: Error | any, ...params: any[]): void;
    error(): boolean;
    error(error: Error | any, ...params: any[]): void;
    fatal(): boolean;
    fatal(error: Error | any, ...params: any[]): void;
    scopedLogEmitter(logLevel: number, obj: object | undefined, ...params: any[]): void;
    _isLogInScope(data: any): boolean;
}
declare const createLogger: (options?: LoggerOptions) => TracingLogger;
export { createLogger };
