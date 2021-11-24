import { createRequire } from "module"
import resolve from "@rollup/plugin-node-resolve"
import esbuild from "rollup-plugin-esbuild"

const pkg = createRequire(import.meta.url)("./package.json")

export default {
  input: pkg.source,
  external: [...Object.keys(pkg.dependencies), "fs", "fs/promises"],
  plugins: [
    resolve({
      extensions: [".ts"]
    }),
    esbuild({
      tsconfig: "tsconfig.build.json",
      minify: true
    })
  ],
  output: {
    file: pkg.bin,
    format: "es",
    banner: "#!/usr/bin/env node\n"
  }
}
