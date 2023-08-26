import { WebSocket } from "ws";
import { msg_types, encode_msg, decode_msg } from "maxwell-protocol";

export interface Request {
  payload: any;
  header?: {
    agent?: string;
    endpoint?: string;
    token?: string;
  };
}

export interface Reply {
  error: {
    code: number;
    desc: string;
  };
  payload?: any;
}

export type Handler =
  | ((req: Request) => Reply)
  | ((req: Request) => Promise<Reply>);

export class Service {
  private _wsRoutes: Map<string, Handler>;

  constructor() {
    this._wsRoutes = new Map();
  }

  public addWsRoute(path: string, handler: Handler) {
    if (handler.constructor.name === "Function") {
      this._wsRoutes.set(path, handler);
    } else if (handler.constructor.name === "AsyncFunction") {
      this._wsRoutes.set(path, handler);
    } else {
      throw new Error(
        `The handler must be a funciton, but got a "${handler.constructor.name}"`
      );
    }
  }

  public getWsRoutes() {
    return this._wsRoutes;
  }

  public async handeleMsg(ws: WebSocket, data: ArrayBuffer) {
    const req = decode_msg(data);
    const reqType = req.constructor;
    if (reqType === msg_types.req_req_t) {
      const handler = this._wsRoutes.get(req.path);
      if (typeof handler === "undefined") {
        ws.send(
          encode_msg(
            new msg_types.error2_rep_t({
              code: 1,
              desc: `Failed to find handler for path: ${req.path}`,
              conn0Ref: req.conn0Ref,
              ref: req.ref,
            })
          )
        );
      } else {
        try {
          const rep = await handler({
            payload: JSON.parse(req.payload),
            header: req.header,
          });
          ws.send(
            encode_msg(
              new msg_types.req_rep_t({
                payload: JSON.stringify(rep),
                conn0Ref: req.conn0Ref,
                ref: req.ref,
              })
            )
          );
        } catch (e) {
          ws.send(
            encode_msg(
              new msg_types.error2_rep_t({
                code: 2,
                desc: `Failed to handle req: ${req}, path: ${req.path}`,
                conn0Ref: req.conn0Ref,
                ref: req.ref,
              })
            )
          );
        }
      }
    } else if (reqType === msg_types.ping_req_t) {
      ws.send(encode_msg(new msg_types.ping_rep_t({ ref: req.ref })));
    } else {
      ws.send(
        encode_msg(
          new msg_types.error2_rep_t({
            code: 1,
            desc: `Received unknown msg: ${req}`,
            conn0Ref: req.conn0Ref,
            ref: req.ref,
          })
        )
      );
    }
  }
}
