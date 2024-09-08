"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = buildOptions;
exports.buildServerOptions = buildServerOptions;
exports.buildWsOptions = buildWsOptions;
exports.buildPublisherOptions = buildPublisherOptions;
exports.buildMasterClientOptions = buildMasterClientOptions;
const maxwell_utils_1 = require("maxwell-utils");
function buildOptions(options) {
    if (typeof options === "undefined") {
        options = {};
    }
    return {
        serverOptions: buildServerOptions(options.serverOptions),
        publisherOptions: buildPublisherOptions(options.publisherOptions),
        masterClientOptions: buildMasterClientOptions(options.masterClientOptions),
    };
}
function buildServerOptions(options) {
    if (typeof options === "undefined") {
        options = {};
    }
    const ip = getIp();
    const port = options.port ?? 9092;
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
function buildWsOptions(options) {
    if (typeof options === "undefined") {
        options = {};
    }
    return {
        maxPayload: options.maxPayload ?? 104857600,
        perMessageDeflate: options.perMessageDeflate ?? false,
    };
}
function buildPublisherOptions(options) {
    if (typeof options === "undefined") {
        options = {};
    }
    return {
        connectionSlotSize: options.connectionSlotSize ?? 1,
        maxContinuousDisconnectedTimes: options.maxContinuousDisconnectedTimes ?? 5,
        endpointCacheSize: options.endpointCacheSize ?? 50000,
        endpointCacheTtl: options.endpointCacheTtl ?? 1000 * 60 * 10,
        connectionOptions: (0, maxwell_utils_1.buildConnectionOptions)(options.connectionOptions),
    };
}
function buildMasterClientOptions(options) {
    if (typeof options === "undefined") {
        options = {};
    }
    return {
        masterEndpoints: options.masterEndpoints ?? ["localhost:8081"],
        connectionOptions: (0, maxwell_utils_1.buildConnectionOptions)(options.connectionOptions),
    };
}
function getIp() {
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
//# sourceMappingURL=options.js.map