import path from "node:path";
import { fastifyAutoload } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { run, PartiallyRequiredOptions } from "../../src";

(async function main() {
  const service: FastifyPluginAsync<PartiallyRequiredOptions> = async (
    fastify,
    options,
  ): Promise<void> => {
    // This loads swagger to document the API
    fastify.register(fastifySwagger);
    fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    void fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, "plugins"),
      options,
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    void fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, "routes"),
      options,
    });
  };

  const options = {
    serverOptions: { id: "service-js-0", port: 9092 },
  };

  await run(service, options);
})();
