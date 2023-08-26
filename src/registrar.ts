import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { Master, Options, Service } from "./internal";

export class Registrar {
  private _master: Master;
  private _options: Options;
  private _service: Service;

  constructor(master: Master, service: Service, options: Options) {
    this._master = master;
    this._options = options;
    this._service = service;
  }

  public async start() {
    this._master.addConnectionListener(
      Event.ON_CONNECTED,
      this._onConnected.bind(this)
    );
  }

  private async _onConnected() {
    await this._registerService();
    await this._setRoutes();
  }

  private async _registerService() {
    const req = new msg_types.register_service_req_t({
      httpPort: this._options.port,
    });
    const res = await this._master.request(req);
    console.info("Register service reply: ", res);
  }

  private async _setRoutes() {
    const routes = this._service.getWsRoutes();
    const req = new msg_types.set_routes_req_t({
      paths: Array.from(routes.keys()),
    });
    const res = await this._master.request(req);
    console.info("Set routes reply: ", res);
  }
}
