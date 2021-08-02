import { readdir } from "fs/promises"
import path from "path"
import execa from "execa"
import loadJSON from "load-json-file"
import { PlainObject } from "../src/types"
import { delay, generateEnvironment } from "./helpers"

const temporaryConfigRegex = /^.tsconfig.\w+.json$/

function isTemporaryConfig(file: string) {
  return temporaryConfigRegex.test(file)
}

describe("tsc-mixed", () => {
  test("should run tsc with included files", async () => {
    const { config, file, error, clean } = await generateEnvironment()

    expect.assertions(2)

    const { exitCode } = await execa("yarn", [
      "tsc-mixed",
      "--project",
      config,
      file
    ])

    expect(exitCode).toBe(0)

    try {
      await execa("yarn", ["tsc-mixed", "--project", config, error])
    } catch (error) {
      expect(error?.exitCode).toBe(0) // eslint-disable-line jest/no-conditional-expect, jest/no-try-expect
    }

    clean()
  })

  test("should create a valid temporary configuration file", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    await delay(1000)

    const files = await readdir(directory)
    const temporaryConfig: PlainObject = await loadJSON(
      path.resolve(directory, files.find(isTemporaryConfig) as string)
    )

    expect(temporaryConfig?.extends).toEqual(path.resolve(directory, config))
    expect(temporaryConfig?.include).toContain(path.resolve(directory, file))

    subprocess.cancel()
    clean()
  })

  test("should remove the temporary configuration file when the process is canceled", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    await delay(1000)

    expect((await readdir(directory)).some(isTemporaryConfig)).toBeTruthy()

    subprocess.cancel()

    await delay(1000)

    expect((await readdir(directory)).some(isTemporaryConfig)).toBeFalsy()

    clean()
  })

  test("should remove the temporary configuration file when the process is killed", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    await delay(1000)

    expect((await readdir(directory)).some(isTemporaryConfig)).toBeTruthy()

    subprocess.kill()

    await delay(1000)

    expect((await readdir(directory)).some(isTemporaryConfig)).toBeFalsy()

    clean()
  })
})
