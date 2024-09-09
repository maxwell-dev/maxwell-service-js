import { buildOptions } from "../src/";

describe("Options", () => {
  it("all", async () => {
    const options = buildOptions({
      masterClientOptions: { masterEndpoints: ["localhost:8082"] },
    });
    expect(options.masterClientOptions.masterEndpoints).toEqual([
      "localhost:8082",
    ]);

    const options2 = buildOptions({
      publisherOptions: { endpointCacheTtl: 30 },
    });
    expect(options2.publisherOptions.endpointCacheTtl).toEqual(30);
  });
});
