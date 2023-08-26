"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registrar = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
class Registrar {
    constructor(master, service, options) {
        this._master = master;
        this._options = options;
        this._service = service;
    }
    async start() {
        this._master.addConnectionListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnected.bind(this));
    }
    async _onConnected() {
        await this._registerService();
        await this._setRoutes();
    }
    async _registerService() {
        const req = new maxwell_protocol_1.msg_types.register_service_req_t({
            httpPort: this._options.port,
        });
        const res = await this._master.request(req);
        console.info("Register service reply: ", res);
    }
    async _setRoutes() {
        const routes = this._service.getWsRoutes();
        const req = new maxwell_protocol_1.msg_types.set_routes_req_t({
            paths: Array.from(routes.keys()),
        });
        const res = await this._master.request(req);
        console.info("Set routes reply: ", res);
    }
}
exports.Registrar = Registrar;
//# sourceMappingURL=registrar.js.map