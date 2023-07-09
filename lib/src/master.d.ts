import { Options, ProtocolMsg } from "maxwell-utils";
export declare class Master {
    private _endpoints;
    private _options;
    private _connection;
    private _endpoint_index;
    private _condition;
    constructor(endpoints: string[], options: Options);
    close(): void;
    request(msg: ProtocolMsg): Promise<any>;
    private _connectToMaster;
    private _disconnectFromMaster;
    private _onConnectToMasterDone;
    private _onConnectToMasterFailed;
    private _nextEndpoint;
}
export default Master;
