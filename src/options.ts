import * as http from "node:http";
import { FastifyHttpOptions, FastifyListenOptions } from "fastify";
import {
  ConnectionOptions,
  ConnectionPoolOptions,
  buildConnectionOptions,
  buildConnectionPoolOptions,
} from "maxwell-utils";

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

export function buildOptions(options?: Options): PartiallyRequiredOptions {
  if (typeof options === "undefined") {
    options = {};
  }
  return {
    serverOptions: buildServerOptions(options.serverOptions),
    publisherOptions: buildPublisherOptions(options.publisherOptions),
    masterClientOptions: buildMasterClientOptions(options.masterClientOptions),
  };
}

export interface ServerOptions
  extends FastifyHttpOptions<http.Server>,
    FastifyListenOptions {
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

export function buildServerOptions(
  options?: ServerOptions,
): PartiallyRequiredServerOptions {
  if (typeof options === "undefined") {
    options = {};
  }
  const ip = getIp();
  const port = options.port ?? 30000;
  return {
    id: options.id ?? `service-${ip}:${port}`,
    host: options.host ?? "0.0.0.0",
    port: port,
    bodyLimit: options.bodyLimit ?? 104857600,
    backlog: options.backlog ?? 2048,
    wsOptions: buildWsOptions(options.wsOptions),
    logger: options.logger ?? {
      level: "info",
      transport: {
        target: "pino-pretty",
      },
    },
    ...options,
  };
}

export interface WsOptions {
  maxPayload?: number;
  perMessageDeflate?: boolean;
}

export function buildWsOptions(options?: WsOptions): Required<WsOptions> {
  if (typeof options === "undefined") {
    options = {};
  }
  return {
    maxPayload: options.maxPayload ?? 104857600,
    perMessageDeflate: options.perMessageDeflate ?? false,
  };
}

export interface PublisherOptions {
  endpointCacheSize?: number;
  endpointCacheTtl?: number;
  maxConsecutiveDisconnectedTimes?: number;
  connectionPoolOptions?: ConnectionPoolOptions;
}

export function buildPublisherOptions(
  options?: PublisherOptions,
): DeepRequired<PublisherOptions> {
  if (typeof options === "undefined") {
    options = {};
  }
  return {
    endpointCacheSize: options.endpointCacheSize ?? 50000,
    endpointCacheTtl: options.endpointCacheTtl ?? 1000 * 60 * 10,
    maxConsecutiveDisconnectedTimes:
      options.maxConsecutiveDisconnectedTimes ?? 5,
    connectionPoolOptions: buildConnectionPoolOptions(
      options.connectionPoolOptions,
    ),
  };
}

export interface MasterClientOptions {
  masterEndpoints?: string[];
  connectionOptions?: ConnectionOptions;
}

export function buildMasterClientOptions(
  options?: MasterClientOptions,
): DeepRequired<MasterClientOptions> {
  if (typeof options === "undefined") {
    options = {};
  }
  return {
    masterEndpoints: options.masterEndpoints ?? ["localhost:8081"],
    connectionOptions: buildConnectionOptions(options.connectionOptions),
  };
}

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object | undefined ? DeepRequired<T[P]> : T[P];
};

function getIp(): string {
  const interfaces = require("node:os").networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const interfaceAddresses = interfaces[interfaceName];
    for (const address of interfaceAddresses) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return "0.0.0.0";
}
