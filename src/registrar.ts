import { FastifyInstance } from "fastify";
import { Logger } from "pino";
import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { MasterClient, PartiallyRequiredOptions } from "./internal";

export class Registrar {
  private _fastify: FastifyInstance;
  private _options: PartiallyRequiredOptions;
  private _logger: Logger;
  private _masterClient: MasterClient;

  constructor(service: FastifyInstance, options: PartiallyRequiredOptions) {
    this._fastify = service;
    this._options = options;
    this._logger = options.serverOptions.logger;
    this._masterClient = MasterClient.singleton(options);
    this._masterClient.addConnectionListener(
      Event.ON_CONNECTED,
      this._onConnectedToMaster.bind(this),
    );
  }

  private async _onConnectedToMaster() {
    if (await this._registerService()) {
      await this._setRoutes();
    }
  }

  private async _registerService() {
    const req = new msg_types.register_service_req_t({
      id: this._options.serverOptions.id,
      httpPort: this._options.serverOptions.port,
    });
    try {
      const res = await this._masterClient.request(req);
      this._logger.info("Successfully to register service: %o", res);
      return true;
    } catch (e) {
      this._logger.error("Failed to register service: %o", e);
      return false;
    }
  }

  private async _setRoutes() {
    try {
      const req = this._buildSetRoutesReq();
      const res = await this._masterClient.request(req);
      this._logger.info("Successfully to set routes: %o", res);
    } catch (e) {
      this._logger.error("Failed to set routes: %o", e);
    }
  }

  private _buildSetRoutesReq() {
    const wsPaths = Array.from(this._fastify.wsRoutes.keys());
    const getPaths = [];
    const postPaths = [];
    const putPaths = [];
    const patchPaths = [];
    const deletePaths = [];
    const headPaths = [];
    const optionsPaths = [];
    const tracePaths = [];
    for (const routes of this._fastify.routes) {
      const path = routes[0]
        .replace(/(.*)\/\*$/, "$1/{*p}")
        .replaceAll(/:([^:/]+)/g, "{$1}");
      for (const route of routes[1]) {
        if (typeof route.websocket !== "undefined" && route.websocket) {
          continue;
        }
        let methods: string[] | string;
        if (typeof route.method === "string") {
          methods = [route.method];
        } else {
          methods = route.method;
        }
        for (const method of methods) {
          switch (method) {
            case "GET":
              getPaths.push(path);
              break;
            case "POST":
              postPaths.push(path);
              break;
            case "PUT":
              putPaths.push(path);
              break;
            case "PATCH":
              patchPaths.push(path);
              break;
            case "DELETE":
              deletePaths.push(path);
              break;
            case "HEAD":
              headPaths.push(path);
              break;
            case "OPTIONS":
              optionsPaths.push(path);
              break;
            case "TRACE":
              tracePaths.push(path);
              break;
            default:
              this._logger.error("Unknown method: %s", method);
          }
        }
      }
    }
    return new msg_types.set_routes_req_t({
      wsPaths,
      getPaths,
      postPaths,
      putPaths,
      patchPaths,
      deletePaths,
      headPaths,
      optionsPaths,
      tracePaths,
    });
  }
}
