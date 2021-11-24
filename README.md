# tsatsiki

🥒 Run `tsc` with both a configuration and specific files.

[![build](https://github.com/bouchenoiremarc/tsatsiki/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bouchenoiremarc/tsatsiki/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/tsatsiki?color=%230cf)](https://www.npmjs.com/package/tsatsiki) [![license](https://img.shields.io/github/license/bouchenoiremarc/tsatsiki?color=%23e4b)](https://github.com/bouchenoiremarc/tsatsiki/blob/main/LICENSE)

## Introduction

`tsatsiki` builds upon TypeScript's own `tsc` to circumvent its `TS5042` error.

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
