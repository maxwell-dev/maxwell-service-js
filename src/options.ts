import { IOptions as ICommonConnectionOptions } from "maxwell-utils";

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
  connection_slot_size?: number;
  maxContinuousDisconnectedTimes?: number;
  endpoint_cache_size?: number;
  endpoint_cache_ttl?: number;
}

export interface IConnectionOptions extends ICommonConnectionOptions {
  waitOpenTimeout?: number;
}

export const OPTIONS: Options = {
  server: {
    master_endpoints: ["localhost:8081"],
    host: "0.0.0.0",
    port: 30000,
    maxPayload: 104857600,
    backlog: 2048,
    path: "/$ws",
  },
  publisher: {
    connection_slot_size: 1,
    maxContinuousDisconnectedTimes: 5,
    endpoint_cache_size: 50000,
    endpoint_cache_ttl: 1000 * 60 * 10,
  },
  connection: {
    waitOpenTimeout: 3000,
    reconnectDelay: 3000,
    heartbeatInterval: 10000,
    defaultRoundTimeout: 5000,
    retryRouteCount: 0,
    sslEnabled: false,
    debugRoundEnabled: false,
  },
};

export default OPTIONS;
