import { FastifyPluginAsync } from "fastify";
import { PartiallyRequiredOptions, Options } from "./internal";
export declare function run(service: FastifyPluginAsync<PartiallyRequiredOptions>, options: Options): Promise<void>;
