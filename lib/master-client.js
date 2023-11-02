"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterClient = void 0;
const abortable_promise_1 = require("@xuchaoqian/abortable-promise");
const maxwell_utils_1 = require("maxwell-utils");
class MasterClient {
    constructor(options) {
        this._options = options;
        this._endpoints = options.server.master_endpoints;
        this._currentEndpointIndex = this._endpoints.length - 1;
        this._connection = new maxwell_utils_1.MultiAltEndpointsConnection(this._pickEndpoint.bind(this), options.connection);
    }
    static singleton(options) {
        if (typeof MasterClient._instance === "undefined") {
            MasterClient._instance = new MasterClient(options);
        }
        return MasterClient._instance;
    }
    close() {
        this._connection.close();
    }
    addConnectionListener(event, listener) {
        this._connection.addListener(event, listener);
    }
    deleteConnectionListener(event, listener) {
        this._connection.deleteListener(event, listener);
    }
    request(msg) {
        return this._connection
            .waitOpen(this._options.connection.waitOpenTimeout)
            .then((connection) => {
            return connection
                .request(msg, this._options.connection.defaultRoundTimeout)
                .then((result) => result);
        });
    }
    _pickEndpoint() {
        this._currentEndpointIndex++;
        if (this._currentEndpointIndex >= this._endpoints.length) {
            this._currentEndpointIndex = 0;
        }
        return abortable_promise_1.AbortablePromise.resolve(this._endpoints[this._currentEndpointIndex]);
    }
}
exports.MasterClient = MasterClient;
exports.default = MasterClient;
//# sourceMappingURL=master-client.js.map