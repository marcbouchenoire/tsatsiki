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

describe("isPlainObject", () => {
  test("should return true for plain objects", () => {
    expect(isPlainObject(object)).toBeTruthy()
  })

  test("should return false for any other types", () => {
    expect(isPlainObject(array)).toBeFalsy()
    expect(isPlainObject(boolean)).toBeFalsy()
    expect(isPlainObject(fun)).toBeFalsy()
    expect(isPlainObject(map)).toBeFalsy()
    expect(isPlainObject(number)).toBeFalsy()
    expect(isPlainObject(set)).toBeFalsy()
    expect(isPlainObject(string)).toBeFalsy()
  })
})
