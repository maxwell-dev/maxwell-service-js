"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const ws_1 = require("ws");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Server {
    constructor(service, options) {
        this._service = service;
        this._options = Server._buildOptions(options);
        this._wss = new ws_1.WebSocketServer(options);
    }
    getOptions() {
        return this._options;
    }
    start() {
        const master = internal_1.Master.singleton(this._options.master_endpoints, new maxwell_utils_1.Options());
        const registrar = new internal_1.Registrar(master, this._service, this._options);
        registrar.start();
        this._wss.on("listening", () => {
            console.info(`Server is listening on ${this._options.host}:${this._options.port}`);
        });
        this._wss.on("error", (error) => {
            console.error(`Error occured: ${error.message}`);
        });
        this._wss.on("wsClientError", (error) => {
            console.error(`wsClientError occured: ${error.message}`);
        });
        this._wss.on("close", () => {
            console.info(`Server was stopped.`);
        });
        this._wss.on("connection", (ws, httpRequest) => {
            console.info(`Connection was established: info: %s`, httpRequest.headers);
            ws.binaryType = "arraybuffer";
            ws.on("message", async (data) => await this._service.handeleMsg(ws, data));
            const key = httpRequest.headers["sec-websocket-key"];
            ws.on("close", (code, reason) => {
                console.info(`Connection was closed: key: ${key}, code: ${code}, reason: "${reason.toString()}"`);
            });
            ws.on("error", (error) => {
                console.error(`WsError occured: code: ${error.message}`);
            });
        });
    }
    stop() {
        this._wss.close();
    }
    static _buildOptions(options) {
        if (typeof options.host === "undefined") {
            options.host = "0.0.0.0";
        }
        if (typeof options.port === "undefined") {
            options.port = 9091;
        }
        if (typeof options.maxPayload === "undefined") {
            options.maxPayload = 104857600;
        }
        if (typeof options.backlog === "undefined") {
            options.backlog = 1024;
        }
        options.path = "/$ws";
        return options;
    }
}
exports.Server = Server;
exports.default = Server;
//# sourceMappingURL=server.js.map