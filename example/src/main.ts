import { join } from "path";
import { fastifyAutoload } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { serve, Options as MaxwellOptions } from "../../src";

const service: FastifyPluginAsync<MaxwellOptions> = async (
  fastify,
  options
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
    dir: join(__dirname, "plugins"),
    options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(fastifyAutoload, {
    dir: join(__dirname, "routes"),
    options,
  });
};

(async function main() {
  const options = new MaxwellOptions();
  await serve(service, options);
})();
