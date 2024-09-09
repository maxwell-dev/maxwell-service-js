"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Publisher {
    constructor(options) {
        this._options = options;
        this._logger = options.serverOptions.logger;
        this._topicLocatlizer = new internal_1.TopicLocatlizer(this._options);
        this._connectionPools = new Map();
        this._consecutiveDisconnectedTimes = new Map();
    }
    close() {
        for (const connectionPool of this._connectionPools.values()) {
            connectionPool.close();
        }
        this._topicLocatlizer.close();
    }
    async publish(topic, value) {
        const connection = await this._getConnection(topic);
        if (!connection.isOpen()) {
            await connection.waitOpen({
                timeout: this._options.publisherOptions.connectionPoolOptions.waitOpenTimeout,
            });
        }
        return await connection.request(this._buildPublishReq(topic, value));
    }
    onDisconnected(connection, ...rest) {
        const endpoint = connection.endpoint();
        const consecutiveDisconnectedTimes = (this._consecutiveDisconnectedTimes.get(endpoint) ?? 0) + 1;
        if (consecutiveDisconnectedTimes >=
            this._options.publisherOptions.maxConsecutiveDisconnectedTimes) {
            const connectionPool = this._connectionPools.get(endpoint);
            this._logger.warn("Dropping the connection pool due to too many consecutive disconnections (%d): name: %s, endpoint: %s", consecutiveDisconnectedTimes, connectionPool?.name(), endpoint);
            connectionPool?.close();
            this._connectionPools.delete(endpoint);
            this._consecutiveDisconnectedTimes.delete(endpoint);
        }
        else {
            this._consecutiveDisconnectedTimes.set(endpoint, consecutiveDisconnectedTimes);
        }
    }
    async _getConnection(topic) {
        const endpoint = await this._topicLocatlizer.locate(topic);
        if (typeof endpoint === "undefined") {
            this._logger.error(`Failed to locate topic: ${topic}`);
            throw new Error(`Failed to locate topic: ${topic}`);
        }
        let connectionPool = this._connectionPools.get(endpoint);
        if (typeof connectionPool === "undefined") {
            connectionPool = new maxwell_utils_1.ConnectionPool(new maxwell_utils_1.ConnectionFactory(endpoint), this._options.publisherOptions.connectionPoolOptions, this);
            this._connectionPools.set(endpoint, connectionPool);
        }
        return connectionPool.getConnection();
    }
    _buildPublishReq(topic, value) {
        return new maxwell_protocol_1.msg_types.push_req_t({ topic, value });
    }
}
exports.Publisher = Publisher;
//# sourceMappingURL=publisher.js.map