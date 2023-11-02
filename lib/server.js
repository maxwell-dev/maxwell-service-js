"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const ws_1 = require("ws");
const internal_1 = require("./internal");
class Server {
    constructor(service, options) {
        this._service = service;
        this._options = options;
        this._wss = new ws_1.WebSocketServer(options.server);
    }
    start() {
        new internal_1.Registrar(this._service, this._options);
        this._wss.on("listening", () => {
            console.info(`Server is listening on ${this._options.server.host}:${this._options.server.port}`);
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
}
exports.Server = Server;
exports.default = Server;
//# sourceMappingURL=server.js.map