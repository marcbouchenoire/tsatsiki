import * as assert from "uvu/assert"
import { isFile } from "../../src/utils/is-file"
import { describe } from "../helpers"

describe("isFile", (it) => {
  it("should return true for files", async () => {
    assert.equal(await isFile("package.json"), true)
  })

  it("should return false for directories", async () => {
    assert.equal(await isFile("src"), false)
  })
})
