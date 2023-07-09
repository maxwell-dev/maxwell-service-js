import {
  Code,
  Event,
  Condition,
  Connection,
  Options,
  ProtocolMsg,
} from "maxwell-utils";

export class Master {
  private _endpoints: string[];
  private _options: Options;
  private _connection: Connection | null;
  private _endpoint_index: number;
  private _condition: Condition;

  constructor(endpoints: string[], options: Options) {
    this._endpoints = endpoints;
    this._options = options;

    this._connection = null;
    this._endpoint_index = -1;
    this._connectToMaster();

    this._condition = new Condition(() => {
      return this._connection !== null && this._connection.isOpen();
    });
  }

  close(): void {
    this._disconnectFromMaster();
    this._condition.clear();
  }

  public async request(msg: ProtocolMsg) {
    await this._condition.wait(this._options.defaultRoundTimeout, msg);
    if (this._connection === null) {
      throw new Error("Connection was lost");
    }
    return await this._connection.request(msg).wait();
  }

  private _connectToMaster(): void {
    this._connection = new Connection(this._nextEndpoint(), this._options);
    this._connection.addListener(
      Event.ON_CONNECTED,
      this._onConnectToMasterDone.bind(this)
    );
    this._connection.addListener(
      Event.ON_ERROR,
      this._onConnectToMasterFailed.bind(this)
    );
  }

  private _disconnectFromMaster() {
    if (!this._connection) {
      return;
    }
    this._connection.deleteListener(
      Event.ON_CONNECTED,
      this._onConnectToMasterDone.bind(this)
    );
    this._connection.deleteListener(
      Event.ON_ERROR,
      this._onConnectToMasterFailed.bind(this)
    );
    this._connection.close();
    this._connection = null;
  }

  private _onConnectToMasterDone() {
    this._condition.notify();
  }

  private _onConnectToMasterFailed(code: Code) {
    if (code === Code.FAILED_TO_CONNECT) {
      this._disconnectFromMaster();
      setTimeout(() => this._connectToMaster(), 1000);
    }
  }

  private _nextEndpoint() {
    this._endpoint_index += 1;
    if (this._endpoint_index >= this._endpoints.length) {
      this._endpoint_index = 0;
    }
    return this._endpoints[this._endpoint_index];
  }
}

export default Master;
