import { FastifyInstance } from "fastify";
import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";

import { MasterClient, Options } from "./internal";

export class Registrar {
  private _fastify: FastifyInstance;
  private _options: Options;
  private _masterClient: MasterClient;

  constructor(service: FastifyInstance, options: Options) {
    this._fastify = service;
    this._options = options;
    this._masterClient = MasterClient.singleton(options);
    this._masterClient.addConnectionListener(
      Event.ON_CONNECTED,
      this._onConnectedToMaster.bind(this)
    );
  }

  private async _onConnectedToMaster() {
    if (await this._registerService()) {
      await this._setRoutes();
    }
  }

  private async _registerService() {
    const req = new msg_types.register_service_req_t({
      httpPort: this._options.serverOptions.port,
    });
    try {
      const res = await this._masterClient.request(req);
      console.info("Successfully to register service: %s", res);
      return true;
    } catch (e) {
      console.error("Failed to register service: %s", e);
      return false;
    }
  }

  private async _setRoutes() {
    try {
      const req = this._buildSetRoutesReq();
      const res = await this._masterClient.request(req);
      console.info("Successfully to set routes: %s", res);
    } catch (e) {
      console.error("Failed to set routes: %s", e);
    }
  }

  private _buildSetRoutesReq() {
    const paths = Array.from(this._fastify.wsRoutes.keys());
    return new msg_types.set_routes_req_t({
      paths,
    });
  }
}
