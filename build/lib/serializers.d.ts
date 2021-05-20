import bunyan from 'bunyan';
declare type BuiltRequest = {
    protocol: string;
    hostname: string;
    port: number | string;
    path: string;
    method: string;
    query: string;
    remote_ip: string;
    remote_port: string | number;
    user_agent: string;
    cookies?: {
        [key: string]: any;
    };
    headers?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    } | string;
};
declare type BuiltResponse = {
    headers?: {
        [key: string]: any;
    };
    status?: string | number;
    type?: string;
};
declare const _default: {
    request: (req: any) => BuiltRequest;
    response: (res: any) => BuiltResponse;
    level: (level: number) => string;
    error: bunyan.Serializer;
};
export = _default;
