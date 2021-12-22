import { basename, resolve } from "path"
import { findUp, pathExists } from "find-up"
import { isFile } from "./is-file"

/**
 * Find a TypeScript configuration file from a path.
 *
 * @param path - A path to a directory to look from or to a configuration file directly.
 */
export async function resolveConfigFile(path: string) {
  if (!(await pathExists(path))) return undefined

  return (await isFile(path))
    ? resolve(path)
    : await findUp("tsconfig.json", { type: "file", cwd: basename(path) })
}
