"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
class Reporter {
    constructor(master, server) {
        this._master = master;
        this._server = server;
    }
    async start() {
        this._master.addConnectionListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnected.bind(this));
    }
    async _onConnected() {
        await this._registerServer();
        await this._addRoutes();
    }
    async _registerServer() {
        const req = new maxwell_protocol_1.msg_types.register_server_req_t({
            httpPort: this._server.getOptions().port,
        });
        const res = await this._master.request(req);
        console.info("register server reply: ", res);
    }
    async _addRoutes() {
        const routes = this._server.getWsRoutes();
        const req = new maxwell_protocol_1.msg_types.add_routes_req_t({
            paths: Array.from(routes.keys()),
        });
        const res = await this._master.request(req);
        console.info("add routes reply: ", res);
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=reporter.js.map