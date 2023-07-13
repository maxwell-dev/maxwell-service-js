import { msg_types } from "maxwell-protocol";
import { Event } from "maxwell-utils";
import { Master, Server } from "./internal";

export class Reporter {
  private _master: Master;
  private _server: Server;

  constructor(master: Master, server: Server) {
    this._master = master;
    this._server = server;
  }

  public async start() {
    this._master.addConnectionListener(
      Event.ON_CONNECTED,
      this._onConnected.bind(this)
    );
  }

  private async _onConnected() {
    await this._registerServer();
    await this._addRoutes();
  }

  private async _registerServer() {
    const req = new msg_types.register_server_req_t({
      httpPort: this._server.getOptions().port,
    });
    const res = await this._master.request(req);
    console.info("register server reply: ", res);
  }

  private async _addRoutes() {
    const routes = this._server.getWsRoutes();
    const req = new msg_types.add_routes_req_t({
      paths: Array.from(routes.keys()),
    });
    const res = await this._master.request(req);
    console.info("add routes reply: ", res);
  }
}
