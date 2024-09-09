import { ProtocolMsg, Connection, IEventHandler } from "maxwell-utils";
import { PartiallyRequiredOptions } from "./internal";
export declare class Publisher implements IEventHandler {
    private _options;
    private _logger;
    private _topicLocatlizer;
    private _connectionPools;
    private _consecutiveDisconnectedTimes;
    constructor(options: PartiallyRequiredOptions);
    close(): void;
    publish(topic: string, value: Uint8Array): Promise<ProtocolMsg>;
    onDisconnected(connection: Connection, ...rest: any[]): void;
    private _getConnection;
    private _buildPublishReq;
}
