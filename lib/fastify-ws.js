"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyWs = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const websocket_1 = require("@fastify/websocket");
const maxwell_protocol_1 = require("maxwell-protocol");
exports.fastifyWs = (0, fastify_plugin_1.default)(async (fastify, options) => {
    fastify.register(websocket_1.fastifyWebsocket, {
        options,
    });
    const wsRoutes = new Map();
    async function handeleMsg(ws, data) {
        const req = (0, maxwell_protocol_1.decode_msg)(data);
        const reqType = req.constructor;
        if (reqType === maxwell_protocol_1.msg_types.req_req_t) {
            const handler = wsRoutes.get(req.path);
            if (typeof handler === "undefined") {
                ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                    code: maxwell_protocol_1.msg_types.error_code_t.UNKNOWN_PATH,
                    desc: `Unknown path: ${req.path}`,
                    conn0Ref: req.conn0Ref,
                    ref: req.ref,
                })));
            }
            else {
                try {
                    const rep = await handler({
                        payload: JSON.parse(req.payload),
                        header: req.header,
                    });
                    if (typeof rep.error !== "undefined" &&
                        rep.error.code !== maxwell_protocol_1.msg_types.error_code_t.OK) {
                        ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                            code: rep.error.code,
                            desc: rep.error.desc,
                            conn0Ref: req.conn0Ref,
                            ref: req.ref,
                        })));
                    }
                    else {
                        ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.req_rep_t({
                            payload: JSON.stringify(rep.payload),
                            conn0Ref: req.conn0Ref,
                            ref: req.ref,
                        })));
                    }
                }
                catch (_e) {
                    ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.error2_rep_t({
                        code: maxwell_protocol_1.msg_types.error_code_t.SERVICE_ERROR,
                        desc: `Failed to handle req: ${req}, path: ${req.path}`,
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
                code: maxwell_protocol_1.msg_types.error_code_t.UNKNOWN_MSG,
                desc: `Received unknown msg: ${req}`,
                conn0Ref: req.conn0Ref,
                ref: req.ref,
            })));
        }
    }
    fastify.register(async () => {
        fastify.get("/$ws", { websocket: true }, (socket, req) => {
            console.info("WsConnection was established: info: %s", req.headers);
            socket.binaryType = "arraybuffer";
            socket.on("message", async (data) => {
                await handeleMsg(socket, data);
            });
            const key = req.headers["sec-websocket-key"];
            socket.on("close", (code, reason) => {
                console.info(`WsConnection was closed: key: ${key}, code: ${code}, reason: "${reason.toString()}"`);
            });
            socket.on("error", (error) => {
                console.error(`WsError occured: code: ${error.message}`);
            });
        });
    });
    fastify.decorate("ws", (path, handler) => {
        wsRoutes.set(path, handler);
    });
    fastify.decorate("wsRoutes", wsRoutes);
});
//# sourceMappingURL=fastify-ws.js.map