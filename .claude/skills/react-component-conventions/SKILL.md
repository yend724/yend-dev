---
name: react-component-conventions
description: React component design conventions focusing on Server/Client component boundaries, composition patterns, and data flow. Auto-triggers when writing or modifying React components to ensure correct RSC patterns and optimal component architecture.
paths: "*.tsx, *.jsx, *.ts, *.js"
---

# React Component Design Conventions

React コンポーネント設計の規約集。Server Components / Client Components の境界設計、Composition パターン、データフローに関するルールを定義する。

## When to Apply

以下の作業時に自動で参照する：

- React コンポーネントの新規作成
- 既存コンポーネントのリファクタリング
- `"use client"` ディレクティブの追加・削除判断
- データ取得パターンの実装
- コンポーネント間のデータフロー設計

## Compatibility

React 19+ / RSC対応フレームワーク

## Rule Categories

| Category               | Prefix         |
| ---------------------- | -------------- |
| Server/Client 境界     | `boundary-`    |
| データ取得             | `fetching-`    |
| Composition パターン   | `composition-` |
| Suspense/ErrorBoundary | `suspense-`    |
| Hooks 設計             | `hooks-`       |
| パフォーマンス           | `perf-`        |
| コーディング規約         | `style-`       |

## Quick Reference

### Server/Client 境界

- [boundary-minimize-use-client](rules/boundary-minimize-use-client.md) - `"use client"` はコンポーネントツリーの末端に置く
- [boundary-leaf-interactivity](rules/boundary-leaf-interactivity.md) - インタラクティブ要素のみを Client Component として切り出す
- [boundary-no-premature-client](rules/boundary-no-premature-client.md) - クライアント機能を使わないのに `"use client"` を付けない
- [boundary-serialize-props](rules/boundary-serialize-props.md) - Server → Client に渡す props はシリアライズ可能にする
- [boundary-context-provider-wrapper](rules/boundary-context-provider-wrapper.md) - Context Provider は専用の Client Component でラップする

### データ取得

- [fetching-server-first](rules/fetching-server-first.md) - データ取得は Server Component で行い、結果を props で渡す
- [fetching-no-useeffect-fetch](rules/fetching-no-useeffect-fetch.md) - 初期データ取得に useEffect を使わない
- [fetching-colocate](rules/fetching-colocate.md) - データ取得はそれを使うコンポーネントにコロケーションする
- [fetching-async-component](rules/fetching-async-component.md) - Server Component は async/await で直接データ取得する

### Composition パターン

- [composition-children-across-boundary](rules/composition-children-across-boundary.md) - children を使って Server Component を Client Component 内に配置する
- [composition-render-prop-for-server](rules/composition-render-prop-for-server.md) - 複雑なレイアウトでは render prop で Server Component を注入する
- [composition-slots-pattern](rules/composition-slots-pattern.md) - 複数の Server Component を Client に渡すには名前付き slots を使う
- [composition-avoid-prop-drilling](rules/composition-avoid-prop-drilling.md) - 深いprops受け渡しより Composition で解決する

### Suspense / ErrorBoundary

- [suspense-granular-boundaries](rules/suspense-granular-boundaries.md) - Suspense 境界は可能な限り細粒度に配置する
- [suspense-avoid-single-wrapper](rules/suspense-avoid-single-wrapper.md) - ページ全体を1つの Suspense で囲まない
- [suspense-parallel-streaming](rules/suspense-parallel-streaming.md) - 独立したデータソースは別々の Suspense で並列ストリーミングする
- [suspense-meaningful-fallback](rules/suspense-meaningful-fallback.md) - fallback は意図を持って選択する
- [errorboundary-isolation](rules/errorboundary-isolation.md) - 障害の影響範囲を限定するために ErrorBoundary を適切に配置する

### Hooks 設計

- [hooks-single-responsibility](rules/hooks-single-responsibility.md) - 1つの custom hook は1つの関心事のみを扱う
- [hooks-extract-logic](rules/hooks-extract-logic.md) - 計算ロジックは hook の外の pure function として抽出する
- [hooks-stable-references](rules/hooks-stable-references.md) - コールバックや依存値の参照安定性を意識する
- [hooks-use-effect-discipline](rules/hooks-use-effect-discipline.md) - useEffect は外部システムとの同期専用にする

### パフォーマンス

- [perf-no-premature-memo](rules/perf-no-premature-memo.md) - useMemo / useCallback を計測なしに使わない
- [perf-transition-heavy-update](rules/perf-transition-heavy-update.md) - 重い状態更新には useTransition を使う
- [perf-deferred-slow-render](rules/perf-deferred-slow-render.md) - 遅いコンポーネントには useDeferredValue で入力のレスポンスを維持する

### コーディング規約

- [style-arrow-named-export](rules/style-arrow-named-export.md) - アロー関数 + named export でコンポーネントを定義する
- [style-props-type](rules/style-props-type.md) - Props の型は type で定義し、React.FC で型付けする
- [style-file-naming](rules/style-file-naming.md) - ファイル名は kebab-case で統一する
- [style-import-order](rules/style-import-order.md) - インポートはカテゴリ順に並べ、グループ間に空行を入れる

## How to Use

個別ルールの詳細は `rules/` ディレクトリ内のファイルを参照。上記 Quick Reference のリンクから各ルールにアクセスできる。

各ルールファイルには以下が含まれる：

- ルールの説明と根拠
- Bad: 間違ったコード例
- Good: 正しいコード例
- 判断に迷うケースのガイダンス
