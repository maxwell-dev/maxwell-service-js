import { msg_types } from "maxwell-protocol";
import { Connection, Event } from "maxwell-utils";
import { TopicLocatlizer, PartiallyRequiredOptions } from "./internal";

export class Publisher {
  private _options: PartiallyRequiredOptions;
  private _topicLocatlizer: TopicLocatlizer;
  private _connections: Map<string, Connection[]>;
  private _continuousDisconnectedTimes: number;

  public constructor(options: PartiallyRequiredOptions) {
    this._options = options;
    this._topicLocatlizer = new TopicLocatlizer(this._options);
    this._connections = new Map(); // { endpoint => [connection0, connection1, ...] }
    this._continuousDisconnectedTimes = 0;
  }

  public async publish(topic: string, value: Uint8Array): Promise<any> {
    const connection = await this._getConnection(topic);
    await connection.waitOpen({
      timeout: this._options.publisherOptions.connectionOptions.waitOpenTimeout,
    });
    return await connection.request(this._buildPublishReq(topic, value));
  }

  private async _getConnection(topic: string): Promise<Connection> {
    const endpoint = await this._topicLocatlizer.locate(topic);
    if (typeof endpoint === "undefined") {
      throw new Error(`Failed to locate topic: ${topic}`);
    }
    let connections = this._connections.get(endpoint);
    if (typeof connections === "undefined") {
      connections = [];
      for (
        let i = 0;
        i < this._options.publisherOptions.connectionSlotSize;
        i++
      ) {
        const connection = new Connection(
          endpoint,
          this._options.publisherOptions.connectionOptions,
        );
        connection.addListener(
          Event.ON_DISCONNECTED,
          this._onDisconnectedToBackend.bind(this),
        );
        connections.push(connection);
      }
      this._connections.set(endpoint, connections);
    }
    return connections[Math.floor(Math.random() * connections.length)];
  }

  private _onDisconnectedToBackend(connection: Connection) {
    this._continuousDisconnectedTimes++;
    if (
      this._continuousDisconnectedTimes >=
      this._options.publisherOptions.maxContinuousDisconnectedTimes
    ) {
      console.warn(
        "Close connection because of too many continuous disconnected times: endpoint: %s",
        connection.endpoint(),
      );
      this._continuousDisconnectedTimes = 0;
      this._connections.delete(connection.endpoint());
      setTimeout(() => connection.close(), 0);
    }
  }

  private _buildPublishReq(topic: string, value: Uint8Array) {
    return new msg_types.push_req_t({ topic, value });
  }
}
