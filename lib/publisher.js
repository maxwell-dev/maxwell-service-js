"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Publisher {
    constructor(options) {
        this._options = options;
        this._topicLocatlizer = new internal_1.TopicLocatlizer(this._options);
        this._connections = new Map();
        this._continuousDisconnectedTimes = 0;
    }
    async publish(topic, value) {
        const connection = await this._getConnection(topic);
        await connection.waitOpen({
            timeout: this._options.publisherOptions.connectionOptions.waitOpenTimeout,
        });
        return await connection.request(this._buildPublishReq(topic, value));
    }
    async _getConnection(topic) {
        const endpoint = await this._topicLocatlizer.locate(topic);
        if (typeof endpoint === "undefined") {
            throw new Error(`Failed to locate topic: ${topic}`);
        }
        let connections = this._connections.get(endpoint);
        if (typeof connections === "undefined") {
            connections = [];
            for (let i = 0; i < this._options.publisherOptions.connectionSlotSize; i++) {
                const connection = new maxwell_utils_1.Connection(endpoint, this._options.publisherOptions.connectionOptions);
                connection.addListener(maxwell_utils_1.Event.ON_DISCONNECTED, this._onDisconnectedToBackend.bind(this));
                connections.push(connection);
            }
            this._connections.set(endpoint, connections);
        }
        return connections[Math.floor(Math.random() * connections.length)];
    }
    _onDisconnectedToBackend(connection) {
        this._continuousDisconnectedTimes++;
        if (this._continuousDisconnectedTimes >=
            this._options.publisherOptions.maxContinuousDisconnectedTimes) {
            console.warn("Close connection because of too many continuous disconnected times: endpoint: %s", connection.endpoint());
            this._continuousDisconnectedTimes = 0;
            this._connections.delete(connection.endpoint());
            setTimeout(() => connection.close(), 0);
        }
    }
    _buildPublishReq(topic, value) {
        return new maxwell_protocol_1.msg_types.push_req_t({ topic, value });
    }
}
exports.Publisher = Publisher;
//# sourceMappingURL=publisher.js.map