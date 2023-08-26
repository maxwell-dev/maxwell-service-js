import { Event, Options, ProtocolMsg } from "maxwell-utils";
export declare class Master {
    private _connection;
    private static _instance;
    constructor(endpoints: string[], options: Options);
    static singleton(endpoints: string[], options: Options): Master;
    close(): void;
    addConnectionListener(event: Event, listener: (result?: any) => void): void;
    deleteConnectionListener(event: Event, listener: (result?: any) => void): void;
    request(msg: ProtocolMsg): Promise<any>;
}
export default Master;
