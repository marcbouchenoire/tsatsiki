import path from "path"
import { watch } from "chokidar"
import execa, { ExecaError } from "execa"
import loadJSON from "load-json-file"
import { PlainObject } from "../src/types"
import { generateEnvironment, on } from "./helpers"

const temporaryConfigRegex = /.tsconfig.\w+.json/

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
      expect((error as ExecaError)?.exitCode).toBe(2) // eslint-disable-line jest/no-conditional-expect, jest/no-try-expect
    }

    clean()
  })

  test("should create a valid temporary configuration file", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, {
      awaitWriteFinish: true,
      ignoreInitial: true
    })
    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    const temporaryConfig: PlainObject = await loadJSON(
      await on(watcher, "add")
    )

    expect(temporaryConfig?.extends).toEqual(path.resolve(directory, config))
    expect(temporaryConfig?.include).toContain(path.resolve(directory, file))

    await watcher.close()
    subprocess.cancel()
    clean()
  })

  test("should remove the temporary configuration file when the process is canceled", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, { ignoreInitial: true })
    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    expect(await on(watcher, "add")).toMatch(temporaryConfigRegex)

    subprocess.cancel()

    expect(await on(watcher, "unlink")).toMatch(temporaryConfigRegex)

    await watcher.close()
    clean()
  })

  test("should remove the temporary configuration file when the process is killed", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, { ignoreInitial: true })
    const subprocess = execa("yarn", [
      "tsc-mixed",
      "--watch",
      "--project",
      config,
      file
    ])

    expect(await on(watcher, "add")).toMatch(temporaryConfigRegex)

    subprocess.kill()

    expect(await on(watcher, "unlink")).toMatch(temporaryConfigRegex)

    await watcher.close()
    clean()
  })
})
