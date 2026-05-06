---
name: typescript-coding-conventions
description: General TypeScript coding conventions for type safety, exported API design, and module structure. Auto-triggers when writing or refactoring TypeScript code outside framework-specific rules.
paths: "*.ts, *.tsx, *.mts, *.cts"
---

# TypeScript Coding Conventions

TypeScript 全般のコーディング規約集。型安全性、公開インターフェースの明示性、モジュール構造、命名規則を中心に定義する。

## When to Apply

以下の作業時に自動で参照する：

- TypeScript ファイルの新規作成
- JavaScript から TypeScript への移行
- 型エラー修正や型定義の改善
- exported function / utility / service の設計
- import / export 構造の整理

## Compatibility

TypeScript 5.0+ / ES2022+

## Rule Categories

| Category | Prefix |
| -------- | ------ |
| 型安全性 | `types-` |
| インターフェース設計 | `interface-` |
| モジュール構成 | `module-` |
| 命名規則 | `naming-` |

## Quick Reference

### 型安全性

- [types-no-any](rules/types-no-any.md) - `any` を避け、`unknown` とジェネリクスを優先する
- [types-narrow-before-assert](rules/types-narrow-before-assert.md) - `as const` を除き、`as` アサーションは可能な限り避ける
- [types-parse-boundary-input](rules/types-parse-boundary-input.md) - 外部入力や不確実なデータは `zod` や `valibot` などで parse してから扱う

### インターフェース設計

- [interface-explicit-export-return](rules/interface-explicit-export-return.md) - export する関数は戻り値型を明示する
- [interface-object-params-for-3plus](rules/interface-object-params-for-3plus.md) - 引数が 3 つ以上なら object parameter を検討する
- [interface-prefer-result-over-try-catch](rules/interface-prefer-result-over-try-catch.md) - 通常フローの失敗は `try/catch` より `Result` 型で表現する

### モジュール構成

- [module-import-type-only](rules/module-import-type-only.md) - 型の import は `import type` を使う
- [module-prefer-named-export](rules/module-prefer-named-export.md) - default export より named export を優先する

### 命名規則

- [naming-variable-camel-case](rules/naming-variable-camel-case.md) - 変数名は `camelCase` を基本にする
- [naming-boolean-prefix](rules/naming-boolean-prefix.md) - boolean は `is` / `has` / `can` などの述語で始める
- [naming-collection-plurality](rules/naming-collection-plurality.md) - collection は複数形、要素は単数形でそろえる
- [naming-function-verb-first](rules/naming-function-verb-first.md) - 関数名は動詞から始め、振る舞いを表す
- [naming-type-pascal-case](rules/naming-type-pascal-case.md) - 型・interface・class・enum は `PascalCase` にする
- [naming-constant-screaming-snake-case](rules/naming-constant-screaming-snake-case.md) - `SCREAMING_SNAKE_CASE` は真に固定された定数だけに使う

## How to Use

個別ルールの詳細は `rules/` ディレクトリ内のファイルを参照。上記 Quick Reference のリンクから各ルールにアクセスできる。

各ルールファイルには以下を含める：

- ルールの説明と根拠
- Bad / Good のコード例
- 迷いやすいケースの判断基準
