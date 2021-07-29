import { basename, dirname, extname, resolve } from "path"

export function renameFileInPath(
  path: string,
  rename: (file: string) => string
) {
  const extension = extname(path)
  const file = basename(path, extension)

  return resolve(dirname(path), `${rename(file)}${extension}`)
}
