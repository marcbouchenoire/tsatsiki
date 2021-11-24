import * as assert from "uvu/assert"
import { generateRandomId } from "../../src/utils/generate-random-id"
import { describe } from "../helpers"

describe("generateRandomId", (it) => {
  it("should generate different values", () => {
    const a = generateRandomId()
    const b = generateRandomId()

    assert.not.equal(a, b)
  })
})
