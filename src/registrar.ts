import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { MasterClient, Options, Service } from "./internal";

export class Registrar {
  private _service: Service;
  private _options: Options;
  private _masterClient: MasterClient;

  constructor(service: Service, options: Options) {
    this._service = service;
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
      httpPort: this._options.server.port,
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
    const routes = this._service.getWsRoutes();
    const req = new msg_types.set_routes_req_t({
      paths: Array.from(routes.keys()),
    });

    try {
      const res = await this._masterClient.request(req);
      console.info("Successfully to set routes: %s", res);
    } catch (e) {
      console.error("Failed to set routes: %s", e);
    }
  }
}
