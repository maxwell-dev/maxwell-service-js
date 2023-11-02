import { WebSocketServer } from "ws";
import { Registrar, Service, Options } from "./internal";

export class Server {
  private _service: Service;
  private _options: Options;
  private _wss: WebSocketServer;

  public constructor(service: Service, options: Options) {
    this._service = service;
    this._options = options;
    this._wss = new WebSocketServer(options.server);
  }

  public start() {
    new Registrar(this._service, this._options);

    this._wss.on("listening", () => {
      console.info(
        `Server is listening on ${this._options.server.host}:${this._options.server.port}`
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
}

export default Server;
