import Logger, { LoggerOptions, Stream } from 'bunyan';
import * as Sentry from '@sentry/node';
export declare type NotFunction<T> = T extends Function ? never : T;
export declare type LogObject<T> = {
    [key: string]: NotFunction<T>;
};
export declare type TracingLoggerOptions = Omit<LoggerOptions, 'name'> & {
    sentry?: typeof Sentry;
    name?: string;
    additionalStreams?: Stream;
};
export declare class TracingLogger extends Logger {
    sentry?: typeof Sentry;
    constructor(options: LoggerOptions, sentry?: typeof Sentry);
    report<T>(obj?: LogObject<T> | Error | string, ...params: NotFunction<T>[]): void;
    trace(): boolean;
    trace<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    debug(): boolean;
    debug<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    info(): boolean;
    info<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    warn(): boolean;
    warn<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    error(): boolean;
    error<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    fatal(): boolean;
    fatal<T>(error: LogObject<T> | Error, ...params: NotFunction<T>[]): void;
    scopedLogEmitter<T>(logLevel: number, obj: LogObject<T> | Error | undefined, ...params: any[]): void;
    _isLogInScope(data: any): boolean;
}
declare const createLogger: (options?: TracingLoggerOptions) => TracingLogger;
export { createLogger };
