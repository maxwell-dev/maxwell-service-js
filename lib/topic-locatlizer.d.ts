import { PartiallyRequiredOptions } from "./internal";
export declare class TopicLocatlizer {
    private _options;
    private _logger;
    private _checksum;
    private _cache;
    private _masterClient;
    constructor(options: PartiallyRequiredOptions);
    close(): void;
    locate(topic: string): Promise<string | undefined>;
    private _onConnectedToMaster;
    private _check;
}
