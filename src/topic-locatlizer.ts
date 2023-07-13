import { LRUCache } from "lru-cache";
import { msg_types } from "maxwell-protocol";
import { Master } from "./internal";

export class TopicLocatlizer {
  private _master: Master;
  private _cache: LRUCache<string, string>;

  constructor(master: Master) {
    this._master = master;
    this._cache = new LRUCache({
      max: 10000,
      ttl: 1000 * 60 * 10,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      fetchMethod: async (topic /*oldValue, { signal }*/) => {
        const req = new msg_types.locate_topic_req_t({
          topic: topic,
        });
        const rep = await this._master.request(req);
        return rep.endpoint;
      },
    });
  }

  async locate(topic: string): Promise<string | undefined> {
    return await this._cache.fetch(topic);
  }
}
