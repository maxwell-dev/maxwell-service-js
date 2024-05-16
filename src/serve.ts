import { fastify as createFastify, FastifyPluginAsync } from "fastify";
import { fastifyRoutes } from "@fastify/routes";
import closeWithGrace from "close-with-grace";
import { fastifyWs, Options, Registrar } from "./internal";

export async function serve(
  service: FastifyPluginAsync<Options>,
  options: Options
): Promise<void> {
  const fastify = createFastify(options.serverOptions);

  await fastify.register(fastifyRoutes);
  await fastify.register(fastifyWs, options.serverOptions.wsOptions);

  await fastify.register(service, options);

  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace(
    { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || "500") },
    async function ({ signal, err }) {
      if (err) {
        fastify.log.error({ err }, "server closing with error");
      } else {
        fastify.log.info(`${signal} received, server closing`);
      }
      await fastify.close();
    } as closeWithGrace.CloseWithGraceAsyncCallback
  );
  fastify.addHook("onClose", async () => {
    closeListeners.uninstall();
  });

  fastify.addHook("onReady", async function () {
    new Registrar(fastify, options);
  });

  await fastify.listen({
    host: options.serverOptions.host,
    port: options.serverOptions.port,
  });
}
