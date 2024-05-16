import { FastifyPluginAsync } from "fastify";
import { Options } from "./internal";
export declare function serve(service: FastifyPluginAsync<Options>, options: Options): Promise<void>;
