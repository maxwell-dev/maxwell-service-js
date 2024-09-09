import fp from "fastify-plugin";
import { Publisher, PartiallyRequiredOptions } from "../../../src";
import { FastifyInstance } from "fastify";

export default fp<PartiallyRequiredOptions>(async (fastify, options) => {
  fastify.decorate("publisher", new Publisher(options));

  setInterval(async () => {
    await publish(fastify);
  }, 1000);
});

async function publish(fastify: FastifyInstance) {
  try {
    const rep = await fastify.publisher.publish(
      "topic_1",
      new TextEncoder().encode("hello"),
    );
    fastify.log.debug("Successufly to publish: %o", rep);
  } catch (e) {
    fastify.log.error("Failed to publish: %o", e);
  }
}

declare module "fastify" {
  export interface FastifyInstance {
    publisher: Publisher;
  }
}
