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

/**
 * Run multiple tests as a named suite.
 *
 * @param name - The name of the test suite.
 * @param callback - The test suite as a callback.
 */
export function describe(name: string, callback: Describer): void {
  const test = suite(name)
  callback(test)

  test.run()
}

/**
 * Generate an isolated test environment containing TypeScript files.
 *
 * @param [configuration] - The TypeScript configuration file name.
 * @param [options] - An optional set of options.
 * @param [options.incremental] - Whether to run TypeScript incrementally.
 */
export async function generateTestEnvironment(
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
