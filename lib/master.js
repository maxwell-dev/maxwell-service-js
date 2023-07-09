"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Master = void 0;
const maxwell_utils_1 = require("maxwell-utils");
class Master {
    constructor(endpoints, options) {
        this._endpoints = endpoints;
        this._options = options;
        this._connection = null;
        this._endpoint_index = -1;
        this._connectToMaster();
        this._condition = new maxwell_utils_1.Condition(() => {
            return this._connection !== null && this._connection.isOpen();
        });
    }
    close() {
        this._disconnectFromMaster();
        this._condition.clear();
    }
    async request(msg) {
        await this._condition.wait(this._options.defaultRoundTimeout, msg);
        if (this._connection === null) {
            throw new Error("Connection was lost");
        }
        return await this._connection.request(msg).wait();
    }
    _connectToMaster() {
        this._connection = new maxwell_utils_1.Connection(this._nextEndpoint(), this._options);
        this._connection.addListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnectToMasterDone.bind(this));
        this._connection.addListener(maxwell_utils_1.Event.ON_ERROR, this._onConnectToMasterFailed.bind(this));
    }
    _disconnectFromMaster() {
        if (!this._connection) {
            return;
        }
        this._connection.deleteListener(maxwell_utils_1.Event.ON_CONNECTED, this._onConnectToMasterDone.bind(this));
        this._connection.deleteListener(maxwell_utils_1.Event.ON_ERROR, this._onConnectToMasterFailed.bind(this));
        this._connection.close();
        this._connection = null;
    }
    _onConnectToMasterDone() {
        this._condition.notify();
    }
    _onConnectToMasterFailed(code) {
        if (code === maxwell_utils_1.Code.FAILED_TO_CONNECT) {
            this._disconnectFromMaster();
            setTimeout(() => this._connectToMaster(), 1000);
        }
    }
    _nextEndpoint() {
        this._endpoint_index += 1;
        if (this._endpoint_index >= this._endpoints.length) {
            this._endpoint_index = 0;
        }
        return this._endpoints[this._endpoint_index];
    }
}
exports.Master = Master;
exports.default = Master;
//# sourceMappingURL=master.js.map