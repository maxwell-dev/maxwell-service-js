import { FastifyInstance } from "fastify";
import { Options } from "./internal";
export declare class Registrar {
    private _fastify;
    private _options;
    private _masterClient;
    constructor(service: FastifyInstance, options: Options);
    private _onConnectedToMaster;
    private _registerService;
    private _setRoutes;
    private _buildSetRoutesReq;
}
