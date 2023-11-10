import { buildDefaultOptions, buildOptions } from "../src/";

describe("Options", () => {
  it("all", async () => {
    const options = buildOptions({
      server: { masterEndpoints: ["localhost:8082"] },
    });
    const optionsDraft = buildDefaultOptions();
    optionsDraft.server.masterEndpoints = ["localhost:8082"];
    expect(options).toEqual(optionsDraft);

    const options2 = buildOptions({
      publisher: { endpointCacheTtl: 30 },
    });
    const optionsDraft2 = buildDefaultOptions();
    optionsDraft2.publisher.endpointCacheTtl = 30;
    expect(options2).toEqual(optionsDraft2);
  });
});
