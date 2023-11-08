import { IOptions as IBasicConnectionOptions } from "maxwell-utils";
export interface IOptions {
    server: IServerOptions;
    publisher: IPublisherOptions;
    connection: IConnectionOptions;
}
export type Options = {
    server: Required<IServerOptions>;
    publisher: Required<IPublisherOptions>;
    connection: Required<IConnectionOptions>;
};
export interface IServerOptions {
    masterEndpoints: string[];
    host?: string;
    port?: number;
    maxPayload?: number;
    backlog?: number;
    readonly path?: string;
}
export interface IPublisherOptions {
    connectionSlotSize?: number;
    maxContinuousDisconnectedTimes?: number;
    endpointCacheSize?: number;
    endpointCacheTtl?: number;
}
export interface IConnectionOptions extends IBasicConnectionOptions {
    waitOpenTimeout?: number;
}
export declare const OPTIONS: Options;
export default OPTIONS;
