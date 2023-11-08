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

export const OPTIONS: Options = {
  server: {
    masterEndpoints: ["localhost:8081"],
    host: "0.0.0.0",
    port: 30000,
    maxPayload: 104857600,
    backlog: 2048,
    path: "/$ws",
  },
  publisher: {
    connectionSlotSize: 1,
    maxContinuousDisconnectedTimes: 5,
    endpointCacheSize: 50000,
    endpointCacheTtl: 1000 * 60 * 10,
  },
  connection: {
    waitOpenTimeout: 3000,
    reconnectDelay: 3000,
    heartbeatInterval: 10000,
    roundTimeout: 5000,
    retryRouteCount: 0,
    sslEnabled: false,
    roundDebugEnabled: false,
  },
};

export default OPTIONS;
