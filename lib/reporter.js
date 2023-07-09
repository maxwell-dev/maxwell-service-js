"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
class Reporter {
    constructor(master, server) {
        this._master = master;
        this._server = server;
    }
    async start() {
        const routes = this._server.getWsRoutes();
        const req = this._createAddRoutes(Array.from(routes.keys()));
        const res = await this._master.request(req);
        console.log(res);
    }
    _createAddRoutes(paths) {
        return new maxwell_protocol_1.msg_types.add_routes_req_t({
            paths,
        });
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=reporter.js.map