import { stat } from "fs/promises"

export async function isFile(path: string) {
  const stats = await stat(path)

  return stats.isFile()
}
