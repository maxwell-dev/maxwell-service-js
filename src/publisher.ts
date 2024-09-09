import { Logger } from "pino";
import { msg_types } from "maxwell-protocol";
import {
  ProtocolMsg,
  Connection,
  ConnectionFactory,
  ConnectionPool,
  IEventHandler,
} from "maxwell-utils";
import { TopicLocatlizer, PartiallyRequiredOptions } from "./internal";

export class Publisher implements IEventHandler {
  private _options: PartiallyRequiredOptions;
  private _logger: Logger;
  private _topicLocatlizer: TopicLocatlizer;
  private _connectionPools: Map<string, ConnectionPool<Connection>>;
  private _consecutiveDisconnectedTimes: Map<string, number>;

  public constructor(options: PartiallyRequiredOptions) {
    this._options = options;
    this._logger = options.serverOptions.logger;
    this._topicLocatlizer = new TopicLocatlizer(this._options);
    this._connectionPools = new Map(); // { endpoint => ConnectionPool<Connection> }
    this._consecutiveDisconnectedTimes = new Map(); // { endpoint => number }
  }

  public close(): void {
    for (const connectionPool of this._connectionPools.values()) {
      connectionPool.close();
    }
    this._topicLocatlizer.close();
  }

  public async publish(topic: string, value: Uint8Array): Promise<ProtocolMsg> {
    const connection = await this._getConnection(topic);
    if (!connection.isOpen()) {
      await connection.waitOpen({
        timeout:
          this._options.publisherOptions.connectionPoolOptions.waitOpenTimeout,
      });
    }
    return await connection.request(this._buildPublishReq(topic, value));
  }

  public onDisconnected(connection: Connection, ...rest: any[]): void {
    const endpoint = connection.endpoint();
    const consecutiveDisconnectedTimes =
      (this._consecutiveDisconnectedTimes.get(endpoint) ?? 0) + 1;
    if (
      consecutiveDisconnectedTimes >=
      this._options.publisherOptions.maxConsecutiveDisconnectedTimes
    ) {
      const connectionPool = this._connectionPools.get(endpoint);
      this._logger.warn(
        "Dropping the connection pool due to too many consecutive disconnections (%d): name: %s, endpoint: %s",
        consecutiveDisconnectedTimes,
        connectionPool?.name(),
        endpoint,
      );
      connectionPool?.close();
      this._connectionPools.delete(endpoint);
      this._consecutiveDisconnectedTimes.delete(endpoint);
    } else {
      this._consecutiveDisconnectedTimes.set(
        endpoint,
        consecutiveDisconnectedTimes,
      );
    }
  }

  private async _getConnection(topic: string): Promise<Connection> {
    const endpoint = await this._topicLocatlizer.locate(topic);
    if (typeof endpoint === "undefined") {
      this._logger.error(`Failed to locate topic: ${topic}`);
      throw new Error(`Failed to locate topic: ${topic}`);
    }
    let connectionPool = this._connectionPools.get(endpoint);
    if (typeof connectionPool === "undefined") {
      connectionPool = new ConnectionPool<Connection>(
        new ConnectionFactory(endpoint),
        this._options.publisherOptions.connectionPoolOptions,
        this,
      );
      this._connectionPools.set(endpoint, connectionPool);
    }
    return connectionPool.getConnection();
  }

  private _buildPublishReq(
    topic: string,
    value: Uint8Array,
  ): typeof msg_types.push_req_t.prototype {
    return new msg_types.push_req_t({ topic, value });
  }
}
