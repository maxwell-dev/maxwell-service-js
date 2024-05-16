"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicLocatlizer = void 0;
const lru_cache_1 = require("lru-cache");
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class TopicLocatlizer {
    constructor(options) {
        this._options = options;
        this._checksum = 0;
        this._cache = new lru_cache_1.LRUCache({
            max: this._options.publisherOptions.endpointCacheSize,
            ttl: this._options.publisherOptions.endpointCacheTtl,
            updateAgeOnGet: true,
            updateAgeOnHas: true,
            fetchMethod: async (topic) => {
                const req = new maxwell_protocol_1.msg_types.locate_topic_req_t({
                    topic: topic,
                });
                const rep = await this._masterClient.request(req);
                return rep.endpoint;
            },
        });
        this._masterClient = internal_1.MasterClient.singleton(options);
        this._masterClient.addConnectionListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnectedToMaster.bind(this));
    }
    async locate(topic) {
        return await this._cache.fetch(topic);
    }
    async _onConnectedToMaster() {
        await this._check();
    }
    async _check() {
        const req = new maxwell_protocol_1.msg_types.get_topic_dist_checksum_req_t();
        console.info("Getting TopicDistChecksum: req: %s", req);
        let rep;
        try {
            rep = await this._masterClient.request(req);
            console.info("Successfully to get TopicDistChecksum: rep: %s", rep);
        }
        catch (e) {
            console.error("Failed to get TopicDistChecksum: %s", e);
            return;
        }
        if (this._checksum != rep.checksum) {
            console.info("TopicDistChecksum has changed: local: %s, remote: %s, clear cache...", this._checksum, rep.checksum);
            this._checksum = rep.checksum;
            this._cache.clear();
        }
        else {
            console.info("TopicDistChecksum stays the same: local: %s, remote: %s, do nothing.", this._checksum, rep.checksum);
        }
    }
}
exports.TopicLocatlizer = TopicLocatlizer;
//# sourceMappingURL=topic-locatlizer.js.map