import { fastify as createFastify, FastifyPluginAsync } from "fastify";
import { fastifyRoutes } from "@fastify/routes";
import closeWithGrace from "close-with-grace";
import {
  fastifyWs,
  PartiallyRequiredOptions,
  Options,
  buildOptions,
  Registrar,
} from "./internal";

export async function run(
  service: FastifyPluginAsync<PartiallyRequiredOptions>,
  options: Options,
): Promise<void> {
  // Build the required options
  const requiredOptions = buildOptions(options);

  // Create the Fastify instance
  const fastify = createFastify(requiredOptions.serverOptions);

  // Register fastify-routes and fastify-ws
  await fastify.register(fastifyRoutes);
  await fastify.register(fastifyWs, requiredOptions.serverOptions.wsOptions);

  // Register the service
  await fastify.register(service, requiredOptions);

  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace(
    { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || "200") },
    (async ({ signal, err }) => {
      if (err) {
        fastify.log.error({ err }, "server closing with error");
      } else {
        fastify.log.info(`${signal} received, server closing`);
      }
      await fastify.close();
    }) as closeWithGrace.CloseWithGraceAsyncCallback,
  );
  fastify.addHook("onClose", async () => {
    closeListeners.uninstall();
  });

  // Register the registrar
  fastify.addHook("onReady", async () => {
    new Registrar(fastify, requiredOptions);
  });

  // Start the server
  await fastify.listen({
    host: requiredOptions.serverOptions.host,
    port: requiredOptions.serverOptions.port,
  });
}
