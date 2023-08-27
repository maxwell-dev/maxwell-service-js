"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const maxwell_protocol_1 = require("maxwell-protocol");
class Service {
    constructor() {
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
    getWsRoutes() {
        return this._wsRoutes;
    }
    async handeleMsg(ws, data) {
        const req = (0, maxwell_protocol_1.decode_msg)(data);
        const reqType = req.constructor;
        if (reqType === maxwell_protocol_1.msg_types.req_req_t) {
            const handler = this._wsRoutes.get(req.path);
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
                    ws.send((0, maxwell_protocol_1.encode_msg)(new maxwell_protocol_1.msg_types.req_rep_t({
                        payload: JSON.stringify(rep),
                        conn0Ref: req.conn0Ref,
                        ref: req.ref,
                    })));
                }
                catch (e) {
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
}
exports.Service = Service;
//# sourceMappingURL=service.js.map