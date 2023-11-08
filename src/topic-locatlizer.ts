import { LRUCache } from "lru-cache";
import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { MasterClient, Options } from "./internal";

export class TopicLocatlizer {
  private _options: Options;
  private _checksum: number;
  private _cache: LRUCache<string, string>;
  private _masterClient: MasterClient;

  public constructor(options: Options) {
    this._options = options;
    this._checksum = 0;
    this._cache = new LRUCache({
      max: this._options.publisher.endpointCacheSize,
      ttl: this._options.publisher.endpointCacheTtl,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      fetchMethod: async (topic /*oldValue, { signal }*/) => {
        const req = new msg_types.locate_topic_req_t({
          topic: topic,
        });
        const rep = await this._masterClient.request(req);
        return rep.endpoint;
      },
    });
    this._masterClient = MasterClient.singleton(options);
    this._masterClient.addConnectionListener(
      Event.ON_CONNECTED,
      this._onConnectedToMaster.bind(this)
    );
  }

  public async locate(topic: string): Promise<string | undefined> {
    return await this._cache.fetch(topic);
  }

  private async _onConnectedToMaster() {
    await this._check();
  }

  private async _check() {
    const req = new msg_types.get_topic_dist_checksum_req_t();
    console.info("Getting TopicDistChecksum: req: %s", req);
    let rep;
    try {
      rep = await this._masterClient.request(req);
      console.info("Successfully to get TopicDistChecksum: rep: %s", rep);
    } catch (e) {
      console.error("Failed to get TopicDistChecksum: %s", e);
      return;
    }
    if (this._checksum != rep.checksum) {
      console.info(
        "TopicDistChecksum has changed: local: %s, remote: %s, clear cache...",
        this._checksum,
        rep.checksum
      );
      this._checksum = rep.checksum;
      this._cache.clear();
    } else {
      console.info(
        "TopicDistChecksum stays the same: local: %s, remote: %s, do nothing.",
        this._checksum,
        rep.checksum
      );
    }
  }
}
