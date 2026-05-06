---
name: testing-conventions
description: Testing conventions covering unit tests, component tests, and E2E tests. Auto-triggers when writing or modifying test files. Uses Vitest for unit/component tests and Playwright for E2E tests.
paths: "*.test.ts, *.test.tsx, *.spec.ts, *.spec.tsx, e2e/**/*"
---

# Testing Conventions

テスト方針の規約集。何をどうテストし、何をスキップするかの判断基準を定義する。

- 単体テスト / コンポーネントテスト: Vitest + Testing Library
- E2E テスト: Playwright

## When to Apply

以下の作業時に自動で参照する：

- テストファイルの作成・修正
- テスト対象のロジックやコンポーネントの実装時
- テスト戦略の設計・レビュー

## Compatibility

Vitest 3+ / Playwright 1.40+ / @testing-library/react 16+

## Rule Categories

| Category             | Prefix       |
| -------------------- | ------------ |
| テスト配置           | `structure-` |
| テスト方針           | `strategy-`  |
| 単体テスト           | `unit-`      |
| コンポーネントテスト | `component-` |
| E2E テスト           | `e2e-`       |

## Quick Reference

### テスト配置

- [structure-colocate](rules/structure-colocate.md) - テストファイルは対象コードと同じディレクトリに置く

### テスト方針

- [strategy-what-to-test](rules/strategy-what-to-test.md) - テストすべきもの・スキップしてよいものの判断基準

### 単体テスト

- [unit-pure-function](rules/unit-pure-function.md) - 振る舞いの単位でテストする
- [unit-aaa-structure](rules/unit-aaa-structure.md) - テストは AAA パターンで構造化する
- [unit-mock-boundary](rules/unit-mock-boundary.md) - モックはプロセス外依存にのみ使う

### コンポーネントテスト

- [component-user-behavior](rules/component-user-behavior.md) - 実装詳細ではなくユーザー行動をテストする
- [component-server-component](rules/component-server-component.md) - Server Component はロジック抽出 + E2E でテストする

### E2E テスト

- [e2e-critical-path](rules/e2e-critical-path.md) - 主要なユーザージャーニーのみをカバーする

## How to Use

個別ルールの詳細は `rules/` ディレクトリ内のファイルを参照。上記 Quick Reference のリンクから各ルールにアクセスできる。
