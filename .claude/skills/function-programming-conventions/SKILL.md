---
name: function-programming-conventions
description: Functional programming conventions for TypeScript logic layers. Auto-triggers when writing utilities, services, domain logic, or data transformation logic to ensure pure functions, immutability, and proper side-effect isolation.
paths: "*.ts"
---

# Functional Programming Conventions

TypeScript のロジック層における関数型プログラミング規約集。純粋関数、イミュータビリティ、副作用の分離を徹底し、テスタブルで予測可能なコードを実現する。

## When to Apply

以下の作業時に自動で参照する：

- ロジック層のコード作成時
- データ変換・加工ロジックの実装
- 状態管理に関わるビジネスロジックの設計
- ユーティリティ関数の作成・リファクタリング

## Compatibility

TypeScript 5.0+ / ES2022+

## Rule Categories

| Category           | Prefix        |
| ------------------ | ------------- |
| 副作用の分離       | `sideeffect-` |
| イミュータブル操作 | `immutable-`  |
| 関数合成           | `compose-`    |
| 型レベル不変性     | `types-`      |

## Quick Reference

### 副作用の分離

- [sideeffect-push-to-boundary](rules/sideeffect-push-to-boundary.md) - 副作用をIO境界に押し出す
- [sideeffect-pure-core](rules/sideeffect-pure-core.md) - ビジネスロジックはpure functionとして書く
- [sideeffect-explicit-dependency](rules/sideeffect-explicit-dependency.md) - 副作用の依存関係を引数で明示する

### イミュータブル操作

- [immutable-const-by-default](rules/immutable-const-by-default.md) - 変数宣言は const をデフォルトにする（var 禁止、let は最小限）
- [immutable-no-mutate-array](rules/immutable-no-mutate-array.md) - 配列の非破壊操作を徹底する（push/splice禁止、spread/toSorted/toSpliced使用）
- [immutable-no-mutate-object](rules/immutable-no-mutate-object.md) - オブジェクトを直接変更しない（Readonly + spread）
- [immutable-derive-dont-accumulate](rules/immutable-derive-dont-accumulate.md) - 導出可能な値を別途保持せず計算で求める

### 関数合成

- [compose-small-functions](rules/compose-small-functions.md) - 関数は小さく、単一目的に保つ
- [compose-pipeline-readable](rules/compose-pipeline-readable.md) - データ変換はパイプライン的に読めるようにする
- [compose-avoid-nested-ternary](rules/compose-avoid-nested-ternary.md) - ネストした三項演算子を避け、early returnやmatch的パターンを使う

### 型レベル不変性

- [types-readonly-by-default](rules/types-readonly-by-default.md) - 型定義はReadonly/ReadonlyArrayをデフォルトにする
- [types-as-const-literals](rules/types-as-const-literals.md) - リテラル型にはas constを活用する
- [types-discriminated-unions](rules/types-discriminated-unions.md) - 状態の網羅性チェックにDiscriminated Unionを使う

## How to Use

個別ルールの詳細は `rules/` ディレクトリ内のファイルを参照。上記 Quick Reference のリンクから各ルールにアクセスできる。

各ルールファイルには以下が含まれる：

- ルールの説明と根拠
- Bad: 間違ったコード例
- Good: 正しいコード例
- 判断基準・原則のガイダンス
