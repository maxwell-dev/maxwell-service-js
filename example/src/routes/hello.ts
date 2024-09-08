import { FastifyPluginAsync } from "fastify";
import { Publisher, PartiallyRequiredOptions } from "../../../src";

export const hello: FastifyPluginAsync<PartiallyRequiredOptions> = async (
  fastify,
  options,
): Promise<void> => {
  fastify.ws("/hello", async (_request) => ({ payload: "world" }));
  fastify.get("/test/:a/:c/:d/1", async (_request, _reply) => ({
    payload: "world",
  }));
  fastify.get("/publish", async (_request, _reply) => {
    await publish(options);
    return "ok";
  });
};

async function publish(options: PartiallyRequiredOptions) {
  const publisher = new Publisher(options);
  try {
    const rep = await publisher.publish(
      "topic_1",
      new TextEncoder().encode("hello"),
    );
    console.log("Successufly to publish: %s", rep);
  } catch (e) {
    console.error("Failed to publish: %s", e);
  }
}

export default hello;
