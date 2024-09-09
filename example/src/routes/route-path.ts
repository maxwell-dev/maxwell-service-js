import { FastifyPluginAsync } from "fastify";
import { PartiallyRequiredOptions } from "../../../src";

export const routePath: FastifyPluginAsync<PartiallyRequiredOptions> = async (
  fastify,
  _options,
): Promise<void> => {
  fastify.get("/test/:a/:c/:d/1", async (_request, _reply) => ({
    payload: "world",
  }));
};

export default routePath;
