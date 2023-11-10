"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = exports.buildDefaultOptions = void 0;
function buildDefaultOptions() {
    return {
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
}
exports.buildDefaultOptions = buildDefaultOptions;
function buildOptions(options) {
    const optionDraft = buildDefaultOptions();
    if (typeof options.server !== "undefined") {
        if (typeof options.server.masterEndpoints !== "undefined") {
            optionDraft.server.masterEndpoints = options.server.masterEndpoints;
        }
        if (typeof options.server.host !== "undefined") {
            optionDraft.server.host = options.server.host;
        }
        if (typeof options.server.port !== "undefined") {
            optionDraft.server.port = options.server.port;
        }
        if (typeof options.server.maxPayload !== "undefined") {
            optionDraft.server.maxPayload = options.server.maxPayload;
        }
        if (typeof options.server.backlog !== "undefined") {
            optionDraft.server.backlog = options.server.backlog;
        }
        if (typeof options.server.path !== "undefined") {
            optionDraft.server.path = options.server.path;
        }
    }
    if (typeof options.publisher !== "undefined") {
        if (typeof options.publisher.connectionSlotSize !== "undefined") {
            optionDraft.publisher.connectionSlotSize =
                options.publisher.connectionSlotSize;
        }
        if (typeof options.publisher.maxContinuousDisconnectedTimes !== "undefined") {
            optionDraft.publisher.maxContinuousDisconnectedTimes =
                options.publisher.maxContinuousDisconnectedTimes;
        }
        if (typeof options.publisher.endpointCacheSize !== "undefined") {
            optionDraft.publisher.endpointCacheSize =
                options.publisher.endpointCacheSize;
        }
        if (typeof options.publisher.endpointCacheTtl !== "undefined") {
            optionDraft.publisher.endpointCacheTtl =
                options.publisher.endpointCacheTtl;
        }
    }
    if (typeof options.connection !== "undefined") {
        if (typeof options.connection.waitOpenTimeout !== "undefined") {
            optionDraft.connection.waitOpenTimeout =
                options.connection.waitOpenTimeout;
        }
        if (typeof options.connection.reconnectDelay !== "undefined") {
            optionDraft.connection.reconnectDelay = options.connection.reconnectDelay;
        }
        if (typeof options.connection.heartbeatInterval !== "undefined") {
            optionDraft.connection.heartbeatInterval =
                options.connection.heartbeatInterval;
        }
        if (typeof options.connection.roundTimeout !== "undefined") {
            optionDraft.connection.roundTimeout = options.connection.roundTimeout;
        }
        if (typeof options.connection.retryRouteCount !== "undefined") {
            optionDraft.connection.retryRouteCount =
                options.connection.retryRouteCount;
        }
        if (typeof options.connection.sslEnabled !== "undefined") {
            optionDraft.connection.sslEnabled = options.connection.sslEnabled;
        }
        if (typeof options.connection.roundDebugEnabled !== "undefined") {
            optionDraft.connection.roundDebugEnabled =
                options.connection.roundDebugEnabled;
        }
    }
    return optionDraft;
}
exports.buildOptions = buildOptions;
exports.default = buildDefaultOptions();
//# sourceMappingURL=options.js.map