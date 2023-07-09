import { Master, Server } from "./internal";
export declare class Reporter {
    private _master;
    private _server;
    constructor(master: Master, server: Server);
    start(): Promise<void>;
    private _createAddRoutes;
}
