/// <reference types="node" />
import * as http from "node:http";
import { FastifyHttpOptions, FastifyListenOptions } from "fastify";
import { PrettyOptions } from "pino-pretty";
import { IOptions as IBasicConnectionOptions } from "maxwell-utils";
export interface IOptions {
    serverOptions?: IServerOptions;
    publisherOptions?: IPublisherOptions;
    masterClientOptions?: IMasterClientOptions;
}
export declare class Options implements IOptions {
    readonly serverOptions: ServerOptions;
    readonly publisherOptions: PublisherOptions;
    readonly masterClientOptions: MasterClientOptions;
    constructor(options?: IOptions);
}
export interface IServerOptions extends FastifyHttpOptions<http.Server>, FastifyListenOptions {
    wsOptions?: IWsOptions;
    loggerOptions?: PrettyOptions;
}
export declare class ServerOptions implements IServerOptions {
    readonly host: string;
    readonly port: number;
    readonly bodyLimit: number;
    readonly backlog: number;
    readonly wsOptions: WsOptions;
    readonly logger: any;
    constructor(options?: IServerOptions);
}
export interface IWsOptions {
    maxPayload?: number;
    perMessageDeflate?: boolean;
}
export declare class WsOptions implements IWsOptions {
    readonly maxPayload: number;
    readonly perMessageDeflate: boolean;
    constructor(options?: IWsOptions);
}
export interface IPublisherOptions {
    connectionSlotSize?: number;
    maxContinuousDisconnectedTimes?: number;
    endpointCacheSize?: number;
    endpointCacheTtl?: number;
    connectionOptions?: IConnectionOptions;
}
export declare class PublisherOptions implements IPublisherOptions {
    readonly connectionSlotSize: number;
    readonly maxContinuousDisconnectedTimes: number;
    readonly endpointCacheSize: number;
    readonly endpointCacheTtl: number;
    readonly connectionOptions: ConnectionOptions;
    constructor(options?: IPublisherOptions);
}
export interface IMasterClientOptions {
    masterEndpoints?: string[];
    connectionOptions?: IConnectionOptions;
}
export declare class MasterClientOptions implements IMasterClientOptions {
    readonly masterEndpoints: string[];
    readonly connectionOptions: ConnectionOptions;
    constructor(options?: IMasterClientOptions);
}
export interface IConnectionOptions extends IBasicConnectionOptions {
    waitOpenTimeout?: number;
}
export declare class ConnectionOptions implements IConnectionOptions {
    readonly waitOpenTimeout: number;
    readonly reconnectDelay: number;
    readonly heartbeatInterval: number;
    readonly roundTimeout: number;
    readonly retryRouteCount: number;
    readonly sslEnabled: boolean;
    readonly roundDebugEnabled: boolean;
    constructor(options?: IConnectionOptions);
}
