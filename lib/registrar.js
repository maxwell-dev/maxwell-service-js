"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registrar = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Registrar {
    constructor(service, options) {
        this._service = service;
        this._options = options;
        this._masterClient = internal_1.MasterClient.singleton(options);
        this._masterClient.addConnectionListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnectedToMaster.bind(this));
    }
    async _onConnectedToMaster() {
        if (await this._registerService()) {
            await this._setRoutes();
        }
    }
    async _registerService() {
        const req = new maxwell_protocol_1.msg_types.register_service_req_t({
            httpPort: this._options.server.port,
        });
        try {
            const res = await this._masterClient.request(req);
            console.info("Successfully to register service: %s", res);
            return true;
        }
        catch (e) {
            console.error("Failed to register service: %s", e);
            return false;
        }
    }
    async _setRoutes() {
        const routes = this._service.getWsRoutes();
        const req = new maxwell_protocol_1.msg_types.set_routes_req_t({
            paths: Array.from(routes.keys()),
        });
        try {
            const res = await this._masterClient.request(req);
            console.info("Successfully to set routes: %s", res);
        }
        catch (e) {
            console.error("Failed to set routes: %s", e);
        }
    }
}
exports.Registrar = Registrar;
//# sourceMappingURL=registrar.js.map