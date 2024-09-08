"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const fastify_1 = require("fastify");
const routes_1 = require("@fastify/routes");
const close_with_grace_1 = __importDefault(require("close-with-grace"));
const internal_1 = require("./internal");
async function run(service, options) {
    const requiredOptions = (0, internal_1.buildOptions)(options);
    const fastify = (0, fastify_1.fastify)(requiredOptions.serverOptions);
    await fastify.register(routes_1.fastifyRoutes);
    await fastify.register(internal_1.fastifyWs, requiredOptions.serverOptions.wsOptions);
    await fastify.register(service, requiredOptions);
    const closeListeners = (0, close_with_grace_1.default)({ delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || "200") }, (async ({ signal, err }) => {
        if (err) {
            fastify.log.error({ err }, "server closing with error");
        }
        else {
            fastify.log.info(`${signal} received, server closing`);
        }
        await fastify.close();
    }));
    fastify.addHook("onClose", async () => {
        closeListeners.uninstall();
    });
    fastify.addHook("onReady", async () => {
        new internal_1.Registrar(fastify, requiredOptions);
    });
    await fastify.listen({
        host: requiredOptions.serverOptions.host,
        port: requiredOptions.serverOptions.port,
    });
}
//# sourceMappingURL=run.js.map