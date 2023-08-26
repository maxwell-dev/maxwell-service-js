import { WebSocketServer } from "ws";
import { Options as ConntionOptions } from "maxwell-utils";
import { Master, Registrar, Service } from "./internal";

export interface Options {
  master_endpoints: string[];
  host?: string;
  port?: number;
  maxPayload?: number;
  backlog?: number;
  path?: string;
}

export class Server {
  private _service: Service;
  private _options: Options;
  private _wss: WebSocketServer;

  constructor(service: Service, options: Options) {
    this._service = service;
    this._options = Server._buildOptions(options);
    this._wss = new WebSocketServer(options);
  }

  public getOptions() {
    return this._options;
  }

  public start() {
    const master = Master.singleton(
      this._options.master_endpoints,
      new ConntionOptions()
    );
    const registrar = new Registrar(master, this._service, this._options);
    registrar.start();

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

      ws.on(
        "message",
        async (data: ArrayBuffer) => await this._service.handeleMsg(ws, data)
      );

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
    options.path = "/$ws";
    return options;
  }
}

export default Server;
