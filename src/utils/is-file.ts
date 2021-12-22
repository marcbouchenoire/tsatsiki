import { stat } from "fs/promises"

/**
 * Whether a path points to a file.
 *
 * @param path - The path to look at.
 */
export async function isFile(path: string) {
  const stats = await stat(path)

  return stats.isFile()
}
