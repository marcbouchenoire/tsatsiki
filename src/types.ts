export type PlainObjectValue = boolean | number | string

export type PlainObject<T extends PlainObjectValue = PlainObjectValue> = Record<
  string,
  T
>
