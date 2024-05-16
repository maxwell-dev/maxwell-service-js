import { Options } from "../src/";

describe("Options", () => {
  it("all", async () => {
    const options = new Options({
      masterClientOptions: { masterEndpoints: ["localhost:8082"] },
    });
    expect(options.masterClientOptions.masterEndpoints).toEqual([
      "localhost:8082",
    ]);

    const options2 = new Options({
      publisherOptions: { endpointCacheTtl: 30 },
    });
    expect(options2.publisherOptions.endpointCacheTtl).toEqual(30);
  });
});
