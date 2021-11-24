import * as assert from "uvu/assert"
import { flattenArguments } from "../../src/utils/flatten-arguments"
import { describe } from "../helpers"

describe("flattenArguments", (it) => {
  it("should create an arguments array from an arguments object", () => {
    assert.equal(flattenArguments({ a: 0, b: true, c: "lorem" }), [
      "--a",
      "0",
      "--b",
      "true",
      "--c",
      "lorem"
    ])
  })
})
