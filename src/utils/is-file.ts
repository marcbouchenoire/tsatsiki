import { stat } from "fs/promises"

export async function isFile(path: string) {
  return (await stat(path))?.isFile()
}
