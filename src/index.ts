#!/usr/bin/env node

import process from "process"
import execa, { ExecaError } from "execa"
import onExit from "exit-hook"
import { sync as rimraf } from "rimraf"
import writeJSON from "write-json-file"
import yargs from "yargs-parser"
import { isPlainObject } from "./guards"
import { PlainObject } from "./types"
import { flattenArguments } from "./utils/flatten-arguments"
import { generateRandomId } from "./utils/generate-random-id"
import { renameFileInPath } from "./utils/rename-file-in-path"
import { resolveConfigFile } from "./utils/resolve-config-file"

const CONFIG_ARGUMENT = "project"
const CONFIG_ARGUMENT_ALIAS = "p"

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
        const temporaryConfig = renameFileInPath(resolvedConfig, (file) => {
          const hiddenFile = file.startsWith(".") ? file : `.${file}`

          return `${hiddenFile}.${generateRandomId()}`
        })

        await writeJSON(temporaryConfig, {
          extends: resolvedConfig,
          include: files
        })

        onExit(() => {
          rimraf(temporaryConfig)
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
