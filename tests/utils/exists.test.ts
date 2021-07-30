import { exists } from "../../src/utils/exists"

describe("exists", () => {
  test("should return true if a file/directory exists", async () => {
    expect(await exists("package.json")).toBeTruthy()
  })

  test("should return false if a file/directory doesn't exist", async () => {
    expect(await exists("package.ts")).toBeFalsy()
  })
})
