import { msg_types } from "maxwell-protocol";
import { Master, Server } from "./internal";

export class Reporter {
  private _master: Master;
  private _server: Server;

  constructor(master: Master, server: Server) {
    this._master = master;
    this._server = server;
  }

  public async start() {
    const routes = this._server.getWsRoutes();
    const req = this._createAddRoutes(Array.from(routes.keys()));
    const res = await this._master.request(req);
    console.log(res);
  }

  private _createAddRoutes(paths: string[]) {
    return new msg_types.add_routes_req_t({
      paths,
    });
  }
}
