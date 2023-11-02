import { AbortablePromise } from "@xuchaoqian/abortable-promise";
import { Event, ProtocolMsg } from "maxwell-utils";
import { Options } from "./internal";
export declare class MasterClient {
    private _options;
    private _endpoints;
    private _currentEndpointIndex;
    private _connection;
    private static _instance;
    constructor(options: Options);
    static singleton(options: Options): MasterClient;
    close(): void;
    addConnectionListener(event: Event, listener: (...args: any[]) => void): void;
    deleteConnectionListener(event: Event, listener: (...args: any[]) => void): void;
    request(msg: ProtocolMsg): AbortablePromise<ProtocolMsg>;
    private _pickEndpoint;
}
export default MasterClient;
