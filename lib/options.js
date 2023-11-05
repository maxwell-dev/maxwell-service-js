"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = void 0;
exports.OPTIONS = {
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
exports.default = exports.OPTIONS;
//# sourceMappingURL=options.js.map