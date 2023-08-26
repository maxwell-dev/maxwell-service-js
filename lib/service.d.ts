import { WebSocket } from "ws";
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
export declare class Service {
    private _wsRoutes;
    constructor();
    addWsRoute(path: string, handler: Handler): void;
    getWsRoutes(): Map<string, Handler>;
    handeleMsg(ws: WebSocket, data: ArrayBuffer): Promise<void>;
}
