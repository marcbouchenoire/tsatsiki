import * as assert from "uvu/assert"
import { resolveConfigFile } from "../../src/utils/resolve-config-file"
import { describe } from "../helpers"

describe("resolveConfigFile", (it) => {
  it("should return a path to a configuration file if there's one", async () => {
    assert.type(await resolveConfigFile("tsconfig.json"), "string")
    assert.type(await resolveConfigFile("."), "string")
  })

  it("should return undefined if no configuration file is found", async () => {
    assert.type(await resolveConfigFile("jsconfig.json"), "undefined")
  })
})
