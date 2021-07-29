import { basename, dirname } from "path"
import { findConfigFile, sys } from "typescript"
import { exists } from "./exists"
import { isFile } from "./is-file"

export async function resolveConfigFile(path: string) {
  if (!(await exists(path))) return undefined

  const isConfigFile = await isFile(path)

  return findConfigFile(
    dirname(path),
    sys.fileExists,
    isConfigFile ? basename(path) : undefined
  )
}
