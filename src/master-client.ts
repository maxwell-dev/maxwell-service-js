import { Event, Connection, Options, ProtocolMsg } from "maxwell-utils";

export class Master {
  private _connection: Connection;
  private static _instance: Master;

  constructor(endpoints: string[], options: Options) {
    this._connection = new Connection(endpoints, options);
  }

  static singleton(endpoints: string[], options: Options): Master {
    if (typeof Master._instance === "undefined") {
      Master._instance = new Master(endpoints, options);
    }
    return Master._instance;
  }

  public close(): void {
    this._connection.close();
  }

  public addConnectionListener(
    event: Event,
    listener: (result?: any) => void
  ): void {
    this._connection.addListener(event, listener);
  }

  public deleteConnectionListener(
    event: Event,
    listener: (result?: any) => void
  ): void {
    this._connection.addListener(event, listener);
  }

  public async request(msg: ProtocolMsg) {
    await this._connection.waitOpen();
    return await this._connection.request(msg).wait();
  }
}

export default Master;
