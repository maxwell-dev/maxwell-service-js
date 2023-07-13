import { Master } from "./internal";
export declare class TopicLocatlizer {
    private _master;
    private _cache;
    constructor(master: Master);
    locate(topic: string): Promise<string | undefined>;
}
