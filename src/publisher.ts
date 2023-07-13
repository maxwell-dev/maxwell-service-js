import { msg_types } from "maxwell-protocol";
import { Connection, Options } from "maxwell-utils";
import { Master, TopicLocatlizer } from "./internal";

export class Publisher {
  private _topicLocatlizer: TopicLocatlizer;
  private _connections: Map<string, Connection>;

  constructor(master: Master) {
    this._topicLocatlizer = new TopicLocatlizer(master);
    this._connections = new Map();
  }

  public async publish(topic: string, value: Uint8Array) {
    const connection = await this._fetchConnection(topic);
    await connection.waitOpen();
    return await connection.request(this._buildPublishReq(topic, value)).wait();
  }

  private async _fetchConnection(topic: string) {
    let connection = this._connections.get(topic);
    if (typeof connection === "undefined") {
      const endpoint = await this._topicLocatlizer.locate(topic);
      if (typeof endpoint === "undefined") {
        throw new Error(`can not locate topic: ${topic}`);
      }
      connection = new Connection([endpoint], new Options());
      this._connections.set(topic, connection);
    }
    return connection;
  }

  private _buildPublishReq(topic: string, value: Uint8Array) {
    return new msg_types.push_req_t({
      topic,
      value,
    });
  }
}
