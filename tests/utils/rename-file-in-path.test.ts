import path from "path"
import * as assert from "uvu/assert"
import { renameFileInPath } from "../../src/utils/rename-file-in-path"
import { describe } from "../helpers"

describe("renameFileInPath", (it) => {
  it("should rename a file in a resolved path", () => {
    const initial = path.resolve("package.json")
    const renamed = path.resolve("packagepackage.json")

    assert.equal(
      renameFileInPath(initial, (file) => `${file}${file}`),
      renamed
    )
  })
})
