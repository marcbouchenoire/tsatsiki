import { writeFile } from "fs/promises"
import path from "path"
import { FSWatcher } from "chokidar"
import { sync as rimraf } from "rimraf"
import tempy from "tempy"
import writeJSON from "write-json-file"

interface Environment {
  clean: () => void
  config: string
  directory: string
  error: string
  file: string
}

export async function generateEnvironment(): Promise<Environment> {
  const directory = tempy.directory()
  const config = path.resolve(directory, "tsconfig.json")
  const file = path.resolve(directory, "file.ts")
  const error = path.resolve(directory, "error.ts")

  await writeJSON(config, {
    compilerOptions: {
      baseUrl: ".",
      esModuleInterop: true,
      lib: ["dom", "esnext"],
      module: "esnext",
      moduleResolution: "node",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "esnext"
    },
    exclude: ["node_modules"]
  })
  await writeFile(file, "export const file = 0")
  await writeFile(error, "export const error: number = '0'")

  const clean = () => {
    rimraf(directory)
  }

  return {
    clean,
    config,
    directory,
    error,
    file
  }
}

export async function on(
  watcher: FSWatcher,
  event: "add" | "unlink"
): Promise<string> {
  return new Promise((resolve) =>
    watcher.on(event, (path: string) => resolve(path))
  )
}
