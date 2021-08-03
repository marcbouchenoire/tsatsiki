# tsc-mixed

📠 ️Run `tsc` with a configuration and files.

[![build](https://github.com/bouchenoiremarc/tsc-mixed/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bouchenoiremarc/tsc-mixed/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/tsc-mixed?color=%230cf)](https://www.npmjs.com/package/tsc-mixed) [![license](https://img.shields.io/github/license/bouchenoiremarc/tsc-mixed?color=%23e4b)](https://github.com/bouchenoiremarc/tsc-mixed/blob/main/LICENSE)

## Introduction

`tsc-mixed` builds upon TypeScript's own `tsc` to circumvent its `TS5042` error.

```sh
tsc --project tsconfig.json index.ts

# error TS5042: Option "project" cannot be mixed with source files on a command line.
```

## Installation

#### Yarn

```sh
yarn add -D tsc-mixed
```

#### npm

```sh
npm install --save-dev tsc-mixed
```

## Usage

Use it as a drop-in `tsc` replacement.

```sh
tsc-mixed --project tsconfig.json index.ts
```

#### `lint-staged`

Use it with [`lint-staged`](https://github.com/okonet/lint-staged) to only type check staged files.

```json
{
  "**/*.{ts,tsx}": ["tsc-mixed --project tsconfig.json"]
}
```
