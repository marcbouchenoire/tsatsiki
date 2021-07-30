import { isFile } from "../../src/utils/is-file"

describe("isFile", () => {
  test("should return true for files", async () => {
    expect(await isFile("package.json")).toBeTruthy()
  })

  test("should return false for directories", async () => {
    expect(await isFile("src")).toBeFalsy()
  })
})
