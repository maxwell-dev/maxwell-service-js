import { Service } from "./internal";
export interface Options {
    master_endpoints: string[];
    host?: string;
    port?: number;
    maxPayload?: number;
    backlog?: number;
    path?: string;
}
export declare class Server {
    private _service;
    private _options;
    private _wss;
    constructor(service: Service, options: Options);
    getOptions(): Options;
    start(): void;
    stop(): void;
    private static _buildOptions;
}
export default Server;
