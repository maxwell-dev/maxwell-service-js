"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Master = void 0;
const maxwell_utils_1 = require("maxwell-utils");
class Master {
    constructor(endpoints, options) {
        this._connection = new maxwell_utils_1.Connection(endpoints, options);
    }
    static singleton(endpoints, options) {
        if (typeof Master._instance === "undefined") {
            Master._instance = new Master(endpoints, options);
        }
        return Master._instance;
    }
    close() {
        this._connection.close();
    }
    addConnectionListener(event, listener) {
        this._connection.addListener(event, listener);
    }
    deleteConnectionListener(event, listener) {
        this._connection.addListener(event, listener);
    }
    async request(msg) {
        await this._connection.waitOpen();
        return await this._connection.request(msg).wait();
    }
}
exports.Master = Master;
exports.default = Master;
//# sourceMappingURL=master-client.js.map