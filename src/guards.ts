import { PlainObject, PlainObjectValue } from "./types"

/**
 * Return whether the value is a plain object.
 *
 * @param value - The value to be checked.
 */
export function isPlainObject<
  T extends PlainObjectValue,
  U extends PlainObject
>(value: PlainObject<T> | U | unknown): value is PlainObject<T> | U {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}
