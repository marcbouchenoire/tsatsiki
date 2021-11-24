import * as assert from "uvu/assert"
import { isPlainObject } from "../src/guards"
import {
  array,
  boolean,
  fun,
  map,
  number,
  object,
  set,
  string
} from "./constants"
import { describe } from "./helpers"

describe("isPlainObject", (it) => {
  it("should return true for plain objects", () => {
    assert.equal(isPlainObject(object), true)
  })

  it("should return false for any other types", () => {
    assert.equal(isPlainObject(array), false)
    assert.equal(isPlainObject(boolean), false)
    assert.equal(isPlainObject(fun), false)
    assert.equal(isPlainObject(map), false)
    assert.equal(isPlainObject(number), false)
    assert.equal(isPlainObject(set), false)
    assert.equal(isPlainObject(string), false)
  })
})
