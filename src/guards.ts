import { PlainObject, PlainObjectValue } from "./types"

export function isPlainObject<
  T extends PlainObjectValue,
  U extends PlainObject
>(value: PlainObject<T> | U | unknown): value is PlainObject<T> | U {
  return typeof value === "object" && value?.constructor === Object
}
