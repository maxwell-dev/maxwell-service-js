import { FastifyPluginAsync } from "fastify";
import { Publisher, Options as MaxwellOptions } from "../../../src";

export const hello: FastifyPluginAsync<MaxwellOptions> = async (
  fastify,
  options
): Promise<void> => {
  fastify.ws("/hello", async function (_request) {
    return { payload: "world" };
  });
  fastify.get("/test/:a/:c/:d/1", async function (_request, _reply) {
    return { payload: "world" };
  });
  fastify.get("/publish", async function (_request, _reply) {
    await publish(options);
    return "ok";
  });
};

async function publish(options: MaxwellOptions) {
  const publisher = new Publisher(options);
  try {
    const rep = await publisher.publish(
      "topic_1",
      new TextEncoder().encode("hello")
    );
    console.log("Successufly to publish: %s", rep);
  } catch (e) {
    console.error("Failed to publish: %s", e);
  }
}

export default hello;
