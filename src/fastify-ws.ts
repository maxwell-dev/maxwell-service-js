import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { fastifyWebsocket } from "@fastify/websocket";
import { WebSocket } from "ws";
import { msg_types, encode_msg, decode_msg } from "maxwell-protocol";
import { WsOptions } from "./internal";

export interface WsRequest {
  readonly payload: any;
  readonly header?: {
    readonly agent?: string;
    readonly endpoint?: string;
    readonly token?: string;
  };
}

export interface WsReply {
  error?: {
    code: number;
    desc: string;
  };
  payload?: any;
}

export type WsHandler =
  | ((req: WsRequest) => WsReply)
  | ((req: WsRequest) => Promise<WsReply>);

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export const fastifyWs: FastifyPluginCallback<WsOptions> = fp<WsOptions>(
  async (fastify, options) => {
    /* Register fastify-websocket to handle ws connections */
    fastify.register(fastifyWebsocket, {
      options,
    });

    /* Internal logic to handle ws routes */
    const wsRoutes: Map<string, WsHandler> = new Map();

    async function handeleMsg(ws: WebSocket, data: ArrayBuffer) {
      const req = decode_msg(data);
      const reqType = req.constructor;
      if (reqType === msg_types.req_req_t) {
        const handler = wsRoutes.get(req.path);
        if (typeof handler === "undefined") {
          ws.send(
            encode_msg(
              new msg_types.error2_rep_t({
                code: msg_types.error_code_t.UNKNOWN_PATH,
                desc: `Unknown path: ${req.path}`,
                conn0Ref: req.conn0Ref,
                ref: req.ref,
              }),
            ),
          );
        } else {
          try {
            const rep: WsReply = await handler({
              payload: JSON.parse(req.payload),
              header: req.header,
            });
            if (
              typeof rep.error !== "undefined" &&
              rep.error.code !== msg_types.error_code_t.OK
            ) {
              ws.send(
                encode_msg(
                  new msg_types.error2_rep_t({
                    code: rep.error.code,
                    desc: rep.error.desc,
                    conn0Ref: req.conn0Ref,
                    ref: req.ref,
                  }),
                ),
              );
            } else {
              ws.send(
                encode_msg(
                  new msg_types.req_rep_t({
                    payload: JSON.stringify(rep.payload),
                    conn0Ref: req.conn0Ref,
                    ref: req.ref,
                  }),
                ),
              );
            }
          } catch (_e) {
            ws.send(
              encode_msg(
                new msg_types.error2_rep_t({
                  code: msg_types.error_code_t.SERVICE_ERROR,
                  desc: `Failed to handle req: ${req}, path: ${req.path}`,
                  conn0Ref: req.conn0Ref,
                  ref: req.ref,
                }),
              ),
            );
          }
        }
      } else if (reqType === msg_types.ping_req_t) {
        ws.send(encode_msg(new msg_types.ping_rep_t({ ref: req.ref })));
      } else {
        ws.send(
          encode_msg(
            new msg_types.error2_rep_t({
              code: msg_types.error_code_t.UNKNOWN_MSG,
              desc: `Received unknown msg: ${req}`,
              conn0Ref: req.conn0Ref,
              ref: req.ref,
            }),
          ),
        );
      }
    }

    /* Register a ws route */
    fastify.register(async () => {
      fastify.get(
        "/$ws",
        { websocket: true },
        (socket /* WebSocket */, req /* FastifyRequest */) => {
          console.info("WsConnection was established: info: %s", req.headers);

          socket.binaryType = "arraybuffer";

          socket.on("message", async (data: ArrayBuffer) => {
            await handeleMsg(socket, data);
          });

          const key = req.headers["sec-websocket-key"];
          socket.on("close", (code: number, reason: Buffer) => {
            console.info(
              `WsConnection was closed: key: ${key}, code: ${code}, reason: "${reason.toString()}"`,
            );
          });

          socket.on("error", (error: Error) => {
            console.error(`WsError occured: code: ${error.message}`);
          });
        },
      );
    });

    /* Decorate the fastify instance to add/get ws routes */
    fastify.decorate("ws", (path: string, handler: WsHandler) => {
      wsRoutes.set(path, handler);
    });
    fastify.decorate("wsRoutes", wsRoutes);
  },
);

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    ws(path: string, handler: WsHandler): void;
    wsRoutes: Map<string, WsHandler>;
  }
}
