import fs from "fs"
import path from "path"
import process from "process"
import type { ExecaError } from "execa"
import { execa } from "execa"
import onExit from "exit-hook"
import { pathExistsSync } from "find-up"
import { writeJsonFile } from "write-json-file"
import yargs from "yargs-parser"
import { isPlainObject } from "./guards"
import type { PlainObject } from "./types"
import { flattenArguments } from "./utils/flatten-arguments"
import { generateRandomId } from "./utils/generate-random-id"
import { resolveConfigFile } from "./utils/resolve-config-file"

const CONFIG_ARGUMENT = "project"
const CONFIG_ARGUMENT_ALIAS = "p"

/**
 * Run TypeScript's CLI.
 *
 * @param [args] - CLI arguments as an object or flattened string.
 */
async function tsc(args: PlainObject | string[] = []) {
  try {
    await execa("tsc", isPlainObject(args) ? flattenArguments(args) : args, {
      stdio: "inherit"
    })
  } catch (error) {
    process.exit((error as ExecaError).exitCode)
  }
}

;(async function () {
  const argv = process.argv.slice(2)
  const {
    _: files,
    [CONFIG_ARGUMENT]: config,
    ...args
  } = yargs(argv, {
    alias: { [CONFIG_ARGUMENT]: [CONFIG_ARGUMENT_ALIAS] },
    configuration: {
      "camel-case-expansion": false,
      "duplicate-arguments-array": false,
      "flatten-duplicate-arrays": false,
      "strip-aliased": true
    }
  })

  try {
    if (config && files.length > 0) {
      const resolvedConfig = await resolveConfigFile(config)

      if (resolvedConfig) {
        const id = generateRandomId()
        const resolvedConfigExtension = path.extname(resolvedConfig)
        const resolvedConfigFile = path.basename(
          resolvedConfig,
          resolvedConfigExtension
        )

        const hiddenConfigFile = resolvedConfigFile.startsWith(".")
          ? resolvedConfigFile
          : `.${resolvedConfigFile}`
        const temporaryConfigFile = `${hiddenConfigFile}.${id}`

        const [temporaryConfig, temporaryBuildInfo] = [
          resolvedConfigExtension,
          ".tsbuildinfo"
        ].map((extension) =>
          path.resolve(
            path.dirname(resolvedConfig),
            `${temporaryConfigFile}${extension}`
          )
        )

        await writeJsonFile(temporaryConfig, {
          extends: resolvedConfig,
          include: files
        })

        onExit(() => {
          for (const temporaryFile of [temporaryConfig, temporaryBuildInfo]) {
            if (pathExistsSync(temporaryFile)) {
              fs.unlinkSync(temporaryFile)
            }
          }
        })

        await tsc({ [CONFIG_ARGUMENT]: temporaryConfig, ...args })
      } else {
        await tsc({ [CONFIG_ARGUMENT]: config, ...args })
      }
    } else {
      throw new Error() // eslint-disable-line unicorn/error-message
    }
  } catch {
    await tsc(argv)
  }
})()
