import { basename, dirname, extname, resolve } from "path"

export function appendFileName(path: string, appendix: string) {
  const extension = extname(path)
  const file = basename(path, extension)

  return resolve(dirname(path), `${file}.${appendix}${extension}`)
}
