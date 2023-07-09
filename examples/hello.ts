import { Server, Request, Reply } from "../src";

const server = new Server({ master_endpoints: ["localhost:8081"], port: 9092 });

server.addWsRoute("/hello", async (req: Request) => {
  const reply: Reply = { payload: req };
  return reply;
});

server.start();
