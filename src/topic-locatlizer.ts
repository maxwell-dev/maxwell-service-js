import { Logger } from "pino";
import { LRUCache } from "lru-cache";
import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { MasterClient, PartiallyRequiredOptions } from "./internal";

export class TopicLocatlizer {
  private _options: PartiallyRequiredOptions;
  private _logger: Logger;
  private _checksum: number;
  private _cache: LRUCache<string, string>;
  private _masterClient: MasterClient;

  public constructor(options: PartiallyRequiredOptions) {
    this._options = options;
    this._logger = options.serverOptions.logger;
    this._checksum = 0;
    this._cache = new LRUCache({
      max: this._options.publisherOptions.endpointCacheSize,
      ttl: this._options.publisherOptions.endpointCacheTtl,
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
      this._onConnectedToMaster.bind(this),
    );
  }

  public close(): void {
    this._cache.clear();
  }

  public async locate(topic: string): Promise<string | undefined> {
    return await this._cache.fetch(topic);
  }

  private async _onConnectedToMaster() {
    await this._check();
  }

  private async _check() {
    const req = new msg_types.get_topic_dist_checksum_req_t();
    this._logger.info("Getting TopicDistChecksum: req: %o", req);
    let rep: typeof msg_types.get_topic_dist_checksum_rep_t.prototype;
    try {
      rep = await this._masterClient.request(req);
      this._logger.info("Successfully to get TopicDistChecksum: rep: %o", rep);
    } catch (e) {
      this._logger.error("Failed to get TopicDistChecksum: %o", e);
      return;
    }
    if (this._checksum !== rep.checksum) {
      this._logger.info(
        "TopicDistChecksum has changed: local: %s, remote: %s, clear cache...",
        this._checksum,
        rep.checksum,
      );
      this._checksum = rep.checksum;
      this._cache.clear();
    } else {
      this._logger.info(
        "TopicDistChecksum stays the same: local: %s, remote: %s, do nothing.",
        this._checksum,
        rep.checksum,
      );
    }
  }
}
