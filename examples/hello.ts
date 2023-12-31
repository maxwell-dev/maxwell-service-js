import {
  Server,
  Service,
  Request,
  Reply,
  Publisher,
  buildDefaultOptions,
} from "../src";

const OPTIONS = buildDefaultOptions();

const publisher = new Publisher(OPTIONS);
async function loop() {
  for (let i = 0; i < 100000000; i++) {
    try {
      const rep = await publisher.publish(
        "topic_1",
        new TextEncoder().encode("hello")
      );
      console.log("Successufly to publish: %s", rep);
    } catch (e) {
      console.error("Failed to publish: %s", e);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
setTimeout(loop, 1000);

const service = new Service();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
service.addWsRoute("/hello", async (req: Request) => {
  const reply: Reply = { payload: "world" };
  return reply;
});

const server = new Server(service, OPTIONS);
server.start();
