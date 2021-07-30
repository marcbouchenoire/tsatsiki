import { flattenArguments } from "../../src/utils/flatten-arguments"

describe("flattenArguments", () => {
  test("should create an arguments array from an arguments object", () => {
    expect(flattenArguments({ a: 0, b: true, c: "lorem" })).toEqual([
      "--a",
      "0",
      "--b",
      "true",
      "--c",
      "lorem"
    ])
  })
})
