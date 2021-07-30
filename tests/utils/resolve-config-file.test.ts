import { resolveConfigFile } from "../../src/utils/resolve-config-file"

describe("resolveConfigFile", () => {
  test("should return a path to a configuration file if there's one", async () => {
    expect(await resolveConfigFile("tsconfig.json")).toBeString()
    expect(await resolveConfigFile(".")).toBeString()
  })

  test("should return undefined if no configuration file is found", async () => {
    expect(await resolveConfigFile("jsconfig.json")).toBeUndefined()
  })
})
