"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicLocatlizer = void 0;
const lru_cache_1 = require("lru-cache");
const maxwell_protocol_1 = require("maxwell-protocol");
class TopicLocatlizer {
    constructor(master) {
        this._master = master;
        this._cache = new lru_cache_1.LRUCache({
            max: 10000,
            ttl: 1000 * 60 * 10,
            updateAgeOnGet: true,
            updateAgeOnHas: true,
            fetchMethod: async (topic) => {
                const req = new maxwell_protocol_1.msg_types.locate_topic_req_t({
                    topic: topic,
                });
                const rep = await this._master.request(req);
                return rep.endpoint;
            },
        });
    }
    async locate(topic) {
        return await this._cache.fetch(topic);
    }
}
exports.TopicLocatlizer = TopicLocatlizer;
//# sourceMappingURL=topic-locatlizer.js.map