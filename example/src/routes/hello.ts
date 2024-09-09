import { FastifyPluginAsync } from "fastify";
import { PartiallyRequiredOptions } from "../../../src";

export const hello: FastifyPluginAsync<PartiallyRequiredOptions> = async (
  fastify,
  _options,
): Promise<void> => {
  fastify.ws("/hello", async (_request) => ({ payload: "world" }));
};

export default hello;
