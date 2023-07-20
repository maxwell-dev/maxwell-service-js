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
export type Handler = ((req: Request) => Reply) | ((req: Request) => Promise<Reply>);
export interface Options {
    master_endpoints: string[];
    host?: string;
    port?: number;
    maxPayload?: number;
    backlog?: number;
    path?: string;
}
export declare class Server {
    private _options;
    private _wss;
    private _wsRoutes;
    constructor(options: Options);
    addWsRoute(path: string, handler: Handler): void;
    getOptions(): Options;
    getWsRoutes(): Map<string, Handler>;
    start(): void;
    stop(): void;
    private static _buildOptions;
}
export default Server;
