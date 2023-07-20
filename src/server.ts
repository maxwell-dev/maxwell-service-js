import { WebSocketServer } from "ws";
import { msg_types, encode_msg, decode_msg } from "maxwell-protocol";
import { Options as ConntionOptions } from "maxwell-utils";
import { Master, Reporter } from "./internal";

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

export interface Options {
  master_endpoints: string[];
  host?: string;
  port?: number;
  maxPayload?: number;
  backlog?: number;
  path?: string;
}

export class Server {
  private _options: Options;
  private _wss: WebSocketServer;
  private _wsRoutes: Map<string, Handler>;

  constructor(options: Options) {
    this._options = Server._buildOptions(options);
    this._wss = new WebSocketServer(options);
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

  public getOptions() {
    return this._options;
  }

  public getWsRoutes() {
    return this._wsRoutes;
  }

  public start() {
    const master = Master.singleton(
      this._options.master_endpoints,
      new ConntionOptions()
    );
    const reporter = new Reporter(master, this);
    reporter.start();

    this._wss.on("listening", () => {
      console.info(
        `Server is listening on ${this._options.host}:${this._options.port}`
      );
    });

    this._wss.on("error", (error: Error) => {
      console.error(`Error occured: ${error.message}`);
    });

    this._wss.on("wsClientError", (error: Error) => {
      console.error(`wsClientError occured: ${error.message}`);
    });

    this._wss.on("close", () => {
      console.info(`Server was stopped.`);
    });

    this._wss.on("connection", (ws, httpRequest) => {
      console.info(`Connection was established: info: %s`, httpRequest.headers);

      ws.binaryType = "arraybuffer";

      ws.on("message", async (data: ArrayBuffer) => {
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
      });

      const key = httpRequest.headers["sec-websocket-key"];
      ws.on("close", (code: number, reason: Buffer) => {
        console.info(
          `Connection was closed: key: ${key}, code: ${code}, reason: "${reason.toString()}"`
        );
      });

      ws.on("error", (error: Error) => {
        console.error(`WsError occured: code: ${error.message}`);
      });
    });
  }

  public stop() {
    this._wss.close();
  }

  private static _buildOptions(options: Options): Options {
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

export default Server;
