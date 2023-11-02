import { IOptions as IMaxwellConnectionOptions } from "maxwell-utils";
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
    master_endpoints: string[];
    host?: string;
    port?: number;
    maxPayload?: number;
    backlog?: number;
    path?: string;
}
export interface IPublisherOptions {
    connection_pool_slot_size?: number;
    maxContinuousDisconnectedTimes?: number;
    lru_cache_size?: number;
    lru_cache_ttl?: number;
}
export interface IConnectionOptions extends IMaxwellConnectionOptions {
    waitOpenTimeout?: number;
}
export declare const OPTIONS: Options;
export default OPTIONS;
