import fs from "fs/promises"
import path from "path"
import { FSWatcher, watch } from "chokidar"
import { ExecaError, execa } from "execa"
import { loadJsonFile } from "load-json-file"
import * as assert from "uvu/assert"
import { describe, generateEnvironment } from "./helpers"

const temporaryConfigRegex = /\.tsconfig\.\w+\.json/
const temporaryBuildInfoRegex = /\.tsconfig\.\w+\.tsbuildinfo/

interface TemporaryConfig {
  extends?: string
  include?: string[]
}

async function watchFor(
  watcher: FSWatcher,
  event: "add" | "unlink"
): Promise<string> {
  return new Promise((resolve) =>
    watcher.on(event, (path: string) => resolve(path))
  )
}

describe("tsatsiki", (it) => {
  it("should run tsc as is", async () => {
    const { config, file, clean } = await generateEnvironment()

    const { exitCode } = await execa("yarn", ["tsatsiki", file])

    assert.equal(exitCode, 0)

    try {
      await execa("yarn", ["tsatsiki", "--project", config])
      assert.unreachable()
    } catch (error) {
      assert.equal((error as ExecaError)?.exitCode, 2)
    }

    try {
      await execa("yarn", ["tsatsiki", "--project", "tsconfig.erroneous.json"])
      assert.unreachable()
    } catch (error) {
      assert.equal((error as ExecaError)?.exitCode, 1)
    }

    clean()
  })

  it("should run tsc with a configuration and included files", async () => {
    const { config, file, error, clean } = await generateEnvironment()

    const { exitCode } = await execa("yarn", [
      "tsatsiki",
      "--project",
      config,
      file
    ])

    assert.equal(exitCode, 0)

    try {
      await execa("yarn", ["tsatsiki", "--project", config, error])
      assert.unreachable()
    } catch (error) {
      assert.equal((error as ExecaError)?.exitCode, 2)
    }

    clean()
  })

  it("should remove temporary files afterwards", async () => {
    const { directory, config, file, clean } = await generateEnvironment(
      ".tsconfig.json",
      {
        incremental: true
      }
    )

    await execa("yarn", ["tsatsiki", "--project", config, file])

    const files = await fs.readdir(directory)

    assert.equal(
      files.some((file) => temporaryConfigRegex.test(file)),
      false
    )
    assert.equal(
      files.some((file) => temporaryBuildInfoRegex.test(file)),
      false
    )

    clean()
  })

  it("should create a valid temporary configuration file", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, {
      awaitWriteFinish: true,
      ignoreInitial: true
    })
    const subprocess = execa("yarn", [
      "tsatsiki",
      "--watch",
      "--project",
      config,
      file
    ])

    const temporaryConfig: TemporaryConfig = await loadJsonFile(
      await watchFor(watcher, "add")
    )

    assert.is(temporaryConfig?.extends, path.resolve(directory, config))
    assert.equal(
      temporaryConfig?.include?.includes(path.resolve(directory, file)),
      true
    )

    await watcher.close()
    subprocess.cancel()
    clean()
  })

  it("should remove temporary files when the process is cancelled", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, { ignoreInitial: true })
    const subprocess = execa("node", [
      "dist/tsatsiki.js",
      "--watch",
      "--project",
      config,
      file
    ])

    assert.match(await watchFor(watcher, "add"), temporaryConfigRegex)

    subprocess.cancel()

    assert.match(await watchFor(watcher, "unlink"), temporaryConfigRegex)

    await watcher.close()
    clean()
  })

  it("should remove temporary files when the process is killed", async () => {
    const { directory, config, file, clean } = await generateEnvironment()

    const watcher = watch(directory, { ignoreInitial: true })
    const subprocess = execa("yarn", [
      "tsatsiki",
      "--watch",
      "--project",
      config,
      file
    ])

    assert.match(await watchFor(watcher, "add"), temporaryConfigRegex)

    subprocess.kill()

    assert.match(await watchFor(watcher, "unlink"), temporaryConfigRegex)

    await watcher.close()
    clean()
  })
})
