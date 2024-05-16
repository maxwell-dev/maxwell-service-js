import { FastifyPluginCallback } from "fastify";
import { WsOptions } from "./internal";
export interface WsRequest {
    readonly payload: any;
    readonly header?: {
        readonly agent?: string;
        readonly endpoint?: string;
        readonly token?: string;
    };
}
export interface WsReply {
    error?: {
        code: number;
        desc: string;
    };
    payload?: any;
}
export type WsHandler = ((req: WsRequest) => WsReply) | ((req: WsRequest) => Promise<WsReply>);
export declare const fastifyWs: FastifyPluginCallback<WsOptions>;
declare module "fastify" {
    interface FastifyInstance {
        ws(path: string, handler: WsHandler): void;
        wsRoutes: Map<string, WsHandler>;
    }
}
