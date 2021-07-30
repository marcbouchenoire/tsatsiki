import path from "path"
import { renameFileInPath } from "../../src/utils/rename-file-in-path"

describe("renameFileInPath", () => {
  test("should rename a file in a resolved path", () => {
    const initial = path.resolve("package.json")
    const renamed = path.resolve("packagepackage.json")

    expect(renameFileInPath(initial, (file) => `${file}${file}`)).toEqual(
      renamed
    )
  })
})
