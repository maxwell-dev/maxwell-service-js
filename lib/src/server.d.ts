import { Service, Options } from "./internal";
export declare class Server {
    private _service;
    private _options;
    private _wss;
    constructor(service: Service, options: Options);
    start(): void;
    stop(): void;
}
export default Server;
