import fs from "fs"
import { writeFile } from "fs/promises"
import path from "path"
import tempy from "tempy"
import { Test, suite } from "uvu"
import { writeJsonFile } from "write-json-file"

type Describer = (test: Test) => Promise<void> | void

interface Environment {
  clean: () => void
  config: string
  directory: string
  error: string
  file: string
}

interface Options {
  incremental?: boolean
}

export function describe(name: string, hook: Describer): void {
  const test = suite(name)
  hook(test)

  test.run()
}

export function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export async function generateEnvironment(
  configuration = "tsconfig.json",
  { incremental }: Options = {}
): Promise<Environment> {
  const directory = tempy.directory()
  const config = path.resolve(directory, configuration)
  const file = path.resolve(directory, "file.ts")
  const error = path.resolve(directory, "error.ts")

  await writeJsonFile(config, {
    compilerOptions: {
      baseUrl: ".",
      esModuleInterop: true,
      lib: ["dom", "esnext"],
      module: "esnext",
      moduleResolution: "node",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "esnext",
      incremental
    },
    exclude: ["node_modules"]
  })
  await writeFile(file, "export const file = 0")
  await writeFile(error, "export const error: number = '0'")

  const clean = () => {
    fs.rmSync(directory, { recursive: true, force: true })
  }

  return {
    clean,
    config,
    directory,
    error,
    file
  }
}
