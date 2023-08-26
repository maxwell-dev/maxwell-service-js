import { Master, Options, Service } from "./internal";
export declare class Registrar {
    private _master;
    private _options;
    private _service;
    constructor(master: Master, service: Service, options: Options);
    start(): Promise<void>;
    private _onConnected;
    private _registerService;
    private _setRoutes;
}
