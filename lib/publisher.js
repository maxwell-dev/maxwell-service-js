"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Publisher {
    constructor(master) {
        this._topicLocatlizer = new internal_1.TopicLocatlizer(master);
        this._connections = new Map();
    }
    async publish(topic, value) {
        const connection = await this._fetchConnection(topic);
        await connection.waitOpen();
        return await connection.request(this._buildPublishReq(topic, value)).wait();
    }
    async _fetchConnection(topic) {
        let connection = this._connections.get(topic);
        if (typeof connection === "undefined") {
            const endpoint = await this._topicLocatlizer.locate(topic);
            if (typeof endpoint === "undefined") {
                throw new Error(`can not locate topic: ${topic}`);
            }
            connection = new maxwell_utils_1.Connection([endpoint], new maxwell_utils_1.Options());
            this._connections.set(topic, connection);
        }
        return connection;
    }
    _buildPublishReq(topic, value) {
        return new maxwell_protocol_1.msg_types.push_req_t({
            topic,
            value,
        });
    }
}
exports.Publisher = Publisher;
//# sourceMappingURL=publisher.js.map