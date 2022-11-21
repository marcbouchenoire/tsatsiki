import fs from "fs"
import { writeFile } from "fs/promises"
import path from "path"
import { temporaryDirectory } from "tempy"
import { Test, suite } from "uvu"
import { writeJsonFile } from "write-json-file"

type Describer = (test: Test) => Promise<void> | void

interface TestEnvironment {
  /**
   * Clean up the temporary environment.
   */
  clean: () => void

  /**
   * The path to the environment's TypeScript configuration file.
   */
  config: string

  /**
   * The path to the environment's directory.
   */
  directory: string

  /**
   * The path to a TypeScript file containing a type error.
   */
  error: string

  /**
   * The path to a correct TypeScript file.
   */
  file: string
}

interface Options {
  /**
   * Whether to run TypeScript incrementally.
   */
  incremental?: boolean
}

/**
 * Run multiple tests as a named suite.
 *
 * @param name - The name of the suite.
 * @param callback - The suite as a function.
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
 * @param [options] - An optional set of settings.
 * @param [options.incremental] - Whether to run TypeScript incrementally.
 */
export async function generateTestEnvironment(
  configuration = "tsconfig.json",
  { incremental }: Options = {}
): Promise<TestEnvironment> {
  const directory = temporaryDirectory()
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
