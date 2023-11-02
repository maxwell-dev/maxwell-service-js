import { Options } from "./internal";
export declare class Publisher {
    private _options;
    private _topicLocatlizer;
    private _connections;
    private _continuousDisconnectedTimes;
    constructor(options: Options);
    publish(topic: string, value: Uint8Array): Promise<any>;
    private _getConnection;
    private _onDisconnectedToBackend;
    private _buildPublishReq;
}
