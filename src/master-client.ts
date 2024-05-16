import { AbortablePromise } from "@xuchaoqian/abortable-promise";
import { Event, MultiAltEndpointsConnection, ProtocolMsg } from "maxwell-utils";
import { Options } from "./internal";

export class MasterClient {
  private _options: Options;
  private _endpoints: string[];
  private _currentEndpointIndex: number;
  private _connection: MultiAltEndpointsConnection;
  private static _instance: MasterClient;

  public constructor(options: Options) {
    this._options = options;
    this._endpoints = options.masterClientOptions.masterEndpoints;
    this._currentEndpointIndex = this._endpoints.length - 1;
    this._connection = new MultiAltEndpointsConnection(
      this._pickEndpoint.bind(this),
      options.masterClientOptions.connectionOptions
    );
  }

  public static singleton(options: Options): MasterClient {
    if (typeof MasterClient._instance === "undefined") {
      MasterClient._instance = new MasterClient(options);
    }
    return MasterClient._instance;
  }

  public close(): void {
    this._connection.close();
  }

  public addConnectionListener(
    event: Event,
    listener: (...args: any[]) => void
  ): void {
    this._connection.addListener(event, listener);
  }

  public deleteConnectionListener(
    event: Event,
    listener: (...args: any[]) => void
  ): void {
    this._connection.deleteListener(event, listener);
  }

  public request(msg: ProtocolMsg): AbortablePromise<ProtocolMsg> {
    return this._connection
      .waitOpen(
        this._options.masterClientOptions.connectionOptions.waitOpenTimeout
      )
      .then((connection) => {
        return connection
          .request(
            msg,
            this._options.masterClientOptions.connectionOptions.roundTimeout
          )
          .then((result) => result);
      });
  }

  private _pickEndpoint(): AbortablePromise<string> {
    this._currentEndpointIndex++;
    if (this._currentEndpointIndex >= this._endpoints.length) {
      this._currentEndpointIndex = 0;
    }
    return AbortablePromise.resolve(
      this._endpoints[this._currentEndpointIndex]
    );
  }
}

export default MasterClient;
