import { FastifyPluginAsync } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { Options as MaxwellOptions } from "../../../src";

export const upload: FastifyPluginAsync<MaxwellOptions> = async (
  fastify,
  _options
): Promise<void> => {
  fastify.register(fastifyMultipart);

  // example: curl -X POST -F "file=@./example/src/main.ts" http://localhost:30000/upload
  fastify.post("/upload", async function (request, reply) {
    const data = await request.file();
    if (!data) {
      reply.code(400).send(new Error("Missing file"));
      return "";
    }
    return new TextDecoder().decode(await data.toBuffer());
  });
};

export default upload;
