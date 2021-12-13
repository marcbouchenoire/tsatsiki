# <img src="https://raw.githubusercontent.com/marcbouchenoire/tsatsiki/main/.github/logo.svg" width="205" height="50" alt="Tsatsiki" />

🥒 Run `tsc` with both a configuration and specific files.

[![build](https://img.shields.io/github/workflow/status/marcbouchenoire/tsatsiki/CI?color=%236c2)](https://github.com/marcbouchenoire/tsatsiki/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/tsatsiki?color=%236c2)](https://www.npmjs.com/package/tsatsiki)
[![coverage](https://img.shields.io/codecov/c/github/marcbouchenoire/tsatsiki?color=%236c2)](https://codecov.io/gh/marcbouchenoire/tsatsiki)
[![license](https://img.shields.io/github/license/marcbouchenoire/tsatsiki?color=%236c2)](https://github.com/marcbouchenoire/tsatsiki/blob/main/LICENSE)

- 📚 **Simple**: A drop-in `tsc` replacement
- 🧪 **Reliable**: Fully tested with [100% code coverage](https://codecov.io/gh/marcbouchenoire/tsatsiki)
- 📦 **Typed**: Written in [TypeScript](https://www.typescriptlang.org/)

## Introduction

Tsatsiki builds upon TypeScript's own `tsc` to circumvent its `TS5042` error.

```bash
tsc --project tsconfig.json index.ts

# error TS5042: Option "project" cannot be mixed with source files on a command line.
```

## Installation

#### Yarn

```bash
yarn add -D tsatsiki
```

#### npm

```bash
npm install --save-dev tsatsiki
```

## Usage

Use it as a drop-in `tsc` replacement.

```bash
tsatsiki --project tsconfig.json index.ts
```

#### `lint-staged`

Use it with [`lint-staged`](https://github.com/okonet/lint-staged) to only type check staged files.

```json
{
  "**/*.{ts,tsx}": ["tsatsiki --project tsconfig.json"]
}
```
