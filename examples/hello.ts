import {
  Server,
  Service,
  Request,
  Reply,
  Publisher,
  OPTIONS as OPTIONS_MUT,
} from "../src";

const OPTIONS = Object.freeze(OPTIONS_MUT);

const publisher = new Publisher(OPTIONS);
async function loop() {
  for (let i = 0; i < 100; i++) {
    try {
      const rep = await publisher.publish(
        "topic_100",
        new TextEncoder().encode("hello")
      );
      console.log("Successufly to publish: %s", rep);
    } catch (e) {
      console.error("Failed to publish: %s", e);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
setTimeout(loop, 1000);

const service = new Service();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
service.addWsRoute("/hello", async (req: Request) => {
  const reply: Reply = { error: { code: 0, desc: "" }, payload: "javascript" };
  return reply;
});

const server = new Server(service, OPTIONS);
server.start();
