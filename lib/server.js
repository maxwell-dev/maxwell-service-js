"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const ws_1 = require("ws");
const maxwell_protocol_1 = require("maxwell-protocol");
const maxwell_utils_1 = require("maxwell-utils");
const internal_1 = require("./internal");
class Server {
    constructor(options) {
        this._options = Server._buildOptions(options);
        this._wss = new ws_1.WebSocketServer(options);
        this._wsRoutes = new Map();
    }
    addWsRoute(path, handler) {
        if (handler.constructor.name === "Function") {
            this._wsRoutes.set(path, handler);
        }
        else if (handler.constructor.name === "AsyncFunction") {
            this._wsRoutes.set(path, handler);
        }
        else {
            throw new Error(`The handler must be a funciton, but got a "${handler.constructor.name}"`);
        }
    }
    getOptions() {
        return this._options;
    }
    getWsRoutes() {
        return this._wsRoutes;
    }
    start() {
        const master = internal_1.Master.singleton(this._options.master_endpoints, new maxwell_utils_1.Options());
        const reporter = new internal_1.Reporter(master, this);
        reporter.start();
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
            ws.on("message", async (data) => {
                const req = (0, maxwell_protocol_1.decode_msg)(data);
                const reqType = req.constructor;
                if (reqType === maxwell_protocol_1.msg_types.req_req_t) {
                    const handler = this._wsRoutes.get(req.path);
                    if (typeof handler === "undefined") {
                        ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                            code: 1,
                            desc: `Failed to find handler for path: ${req.path}`,
                            conn0Ref: req.conn0Ref,
                            ref: req.ref,
                        })));
                    }
                    else {
                        const rep = await handler({
                            payload: JSON.parse(req.payload),
                            header: req.header,
                        });
                        if (typeof rep.error === "undefined") {
                            ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.req_rep_t({
                                payload: JSON.stringify(rep.payload),
                                conn0Ref: req.conn0Ref,
                                ref: req.ref,
                            })));
                        }
                        else {
                            ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                                code: rep.error.code,
                                desc: rep.error.desc,
                                conn0Ref: req.conn0Ref,
                                ref: req.ref,
                            })));
                        }
                    }
                }
                else if (reqType === maxwell_protocol_1.msg_types.ping_req_t) {
                    ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.ping_rep_t({ ref: req.ref })));
                }
                else {
                    ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                        code: 1,
                        desc: `Received unknown msg: ${req}`,
                        conn0Ref: req.conn0Ref,
                        ref: req.ref,
                    })));
                }
            });
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
        options.path = "/ws";
        return options;
    }
}
exports.Server = Server;
exports.default = Server;
//# sourceMappingURL=server.js.map