import * as http from "node:http";
import { FastifyHttpOptions, FastifyListenOptions } from "fastify";
import { ConnectionOptions } from "maxwell-utils";
export interface Options {
    serverOptions?: ServerOptions;
    publisherOptions?: PublisherOptions;
    masterClientOptions?: MasterClientOptions;
}
export interface PartiallyRequiredOptions extends Options {
    serverOptions: PartiallyRequiredServerOptions;
    publisherOptions: DeepRequired<PublisherOptions>;
    masterClientOptions: DeepRequired<MasterClientOptions>;
}
export declare function buildOptions(options?: Options): PartiallyRequiredOptions;
export interface ServerOptions extends FastifyHttpOptions<http.Server>, FastifyListenOptions {
    id?: string;
    wsOptions?: WsOptions;
    logger?: any;
}
export interface PartiallyRequiredServerOptions extends ServerOptions {
    id: string;
    host: string;
    port: number;
    bodyLimit: number;
    backlog: number;
    wsOptions: WsOptions;
    logger: any;
}
export declare function buildServerOptions(options?: ServerOptions): PartiallyRequiredServerOptions;
export interface WsOptions {
    maxPayload?: number;
    perMessageDeflate?: boolean;
}
export declare function buildWsOptions(options?: WsOptions): Required<WsOptions>;
export interface PublisherOptions {
    connectionSlotSize?: number;
    maxContinuousDisconnectedTimes?: number;
    endpointCacheSize?: number;
    endpointCacheTtl?: number;
    connectionOptions?: ConnectionOptions;
}
export declare function buildPublisherOptions(options?: PublisherOptions): DeepRequired<PublisherOptions>;
export interface MasterClientOptions {
    masterEndpoints?: string[];
    connectionOptions?: ConnectionOptions;
}
export declare function buildMasterClientOptions(options?: MasterClientOptions): DeepRequired<MasterClientOptions>;
type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object | undefined ? DeepRequired<T[P]> : T[P];
};
export {};
