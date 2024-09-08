import { FastifyInstance } from "fastify";
import { PartiallyRequiredOptions } from "./internal";
export declare class Registrar {
    private _fastify;
    private _options;
    private _masterClient;
    constructor(service: FastifyInstance, options: PartiallyRequiredOptions);
    private _onConnectedToMaster;
    private _registerService;
    private _setRoutes;
    private _buildSetRoutesReq;
}
