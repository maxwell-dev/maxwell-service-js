import { Options, Service } from "./internal";
export declare class Registrar {
    private _service;
    private _options;
    private _masterClient;
    constructor(service: Service, options: Options);
    private _onConnectedToMaster;
    private _registerService;
    private _setRoutes;
}
