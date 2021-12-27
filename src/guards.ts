import { PlainObject, PlainObjectValue } from "./types"

/**
 * Whether the value is a plain object.
 *
 * @param value - The value to check.
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
