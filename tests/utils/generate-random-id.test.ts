import { generateRandomId } from "../../src/utils/generate-random-id"

describe("generateRandomId", () => {
  test("should generate different values", () => {
    const a = generateRandomId()
    const b = generateRandomId()

    expect(a).not.toEqual(b)
  })
})
