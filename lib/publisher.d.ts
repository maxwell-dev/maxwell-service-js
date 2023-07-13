import { Master } from "./internal";
export declare class Publisher {
    private _topicLocatlizer;
    private _connections;
    constructor(master: Master);
    publish(topic: string, value: Uint8Array): Promise<any>;
    private _fetchConnection;
    private _buildPublishReq;
}
