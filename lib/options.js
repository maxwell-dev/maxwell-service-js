"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionOptions = exports.MasterClientOptions = exports.PublisherOptions = exports.WsOptions = exports.ServerOptions = exports.Options = void 0;
class Options {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        this.serverOptions = new ServerOptions(options.serverOptions);
        this.publisherOptions = new PublisherOptions(options.publisherOptions);
        this.masterClientOptions = new MasterClientOptions(options.masterClientOptions);
    }
}
exports.Options = Options;
class ServerOptions {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.id === "undefined") {
            options.id = "service-0";
        }
        if (typeof options.host === "undefined") {
            options.host = "0.0.0.0";
        }
        if (typeof options.port === "undefined") {
            options.port = 30000;
        }
        if (typeof options.bodyLimit === "undefined") {
            options.bodyLimit = 104857600;
        }
        if (typeof options.backlog === "undefined") {
            options.backlog = 2048;
        }
        if (typeof options.loggerOptions === "undefined") {
            options.logger = {
                transport: { target: "pino-pretty" },
            };
        }
        else {
            options.logger = {
                transport: { target: "pino-pretty", options: options.loggerOptions },
            };
        }
        this.id = options.id;
        this.host = options.host;
        this.port = options.port;
        this.bodyLimit = options.bodyLimit;
        this.backlog = options.backlog;
        this.wsOptions = new WsOptions(options.wsOptions);
        this.logger = options.logger;
    }
}
exports.ServerOptions = ServerOptions;
class WsOptions {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.maxPayload === "undefined") {
            options.maxPayload = 104857600;
        }
        if (typeof options.perMessageDeflate === "undefined") {
            options.perMessageDeflate = false;
        }
        this.maxPayload = options.maxPayload;
        this.perMessageDeflate = options.perMessageDeflate;
    }
}
exports.WsOptions = WsOptions;
class PublisherOptions {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.connectionSlotSize === "undefined") {
            options.connectionSlotSize = 1;
        }
        if (typeof options.maxContinuousDisconnectedTimes === "undefined") {
            options.maxContinuousDisconnectedTimes = 5;
        }
        if (typeof options.endpointCacheSize === "undefined") {
            options.endpointCacheSize = 50000;
        }
        if (typeof options.endpointCacheTtl === "undefined") {
            options.endpointCacheTtl = 1000 * 60 * 10;
        }
        this.connectionSlotSize = options.connectionSlotSize;
        this.maxContinuousDisconnectedTimes =
            options.maxContinuousDisconnectedTimes;
        this.endpointCacheSize = options.endpointCacheSize;
        this.endpointCacheTtl = options.endpointCacheTtl;
        this.connectionOptions = new ConnectionOptions(options.connectionOptions);
    }
}
exports.PublisherOptions = PublisherOptions;
class MasterClientOptions {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.masterEndpoints === "undefined") {
            options.masterEndpoints = ["localhost:8081"];
        }
        this.masterEndpoints = options.masterEndpoints;
        this.connectionOptions = new ConnectionOptions(options.connectionOptions);
    }
}
exports.MasterClientOptions = MasterClientOptions;
class ConnectionOptions {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.waitOpenTimeout === "undefined") {
            options.waitOpenTimeout = 3000;
        }
        if (typeof options.reconnectDelay === "undefined") {
            options.reconnectDelay = 3000;
        }
        if (typeof options.heartbeatInterval === "undefined") {
            options.heartbeatInterval = 10000;
        }
        if (typeof options.roundTimeout === "undefined") {
            options.roundTimeout = 5000;
        }
        if (typeof options.retryRouteCount === "undefined") {
            options.retryRouteCount = 0;
        }
        if (typeof options.sslEnabled === "undefined") {
            options.sslEnabled = false;
        }
        if (typeof options.roundDebugEnabled === "undefined") {
            options.roundDebugEnabled = false;
        }
        this.waitOpenTimeout = options.waitOpenTimeout;
        this.reconnectDelay = options.reconnectDelay;
        this.heartbeatInterval = options.heartbeatInterval;
        this.roundTimeout = options.roundTimeout;
        this.retryRouteCount = options.retryRouteCount;
        this.sslEnabled = options.sslEnabled;
        this.roundDebugEnabled = options.roundDebugEnabled;
    }
}
exports.ConnectionOptions = ConnectionOptions;
//# sourceMappingURL=options.js.map