---
name: nextjs-app-router-conventions
description: Next.js App Router conventions covering file-based routing, caching strategies, Server Actions, Metadata API, and framework-specific patterns. Auto-triggers when working within Next.js App Router projects (app/ directory, next.config, route handlers). Covers file-based routing, caching, Server Actions, Metadata API, and framework-specific patterns.
paths: "src/**/*.tsx, src/**/*.ts, proxy.ts, next.config.*"
---

# Next.js App Router Conventions

Next.js App Router のフレームワーク固有規約集。ファイルベースルーティング、キャッシュ戦略、Server Actions、Metadata API に関するルールを定義する。

## When to Apply

以下の作業時に自動で参照する：

- ページ・レイアウトの作成
- Server Actions の実装
- Route Handler の作成
- キャッシュ戦略の設計
- Metadata / OGP の設定
- Proxy の実装

## Compatibility

Next.js 16+

## Rule Categories

| Category             | Prefix        |
| -------------------- | ------------- |
| ファイル規約         | `file-`       |
| Server Actions       | `actions-`    |
| キャッシュ戦略       | `cache-`      |
| Metadata / SEO       | `metadata-`   |
| ルーティングパターン | `routing-`    |
| Proxy                | `proxy-`      |

## Quick Reference

### ファイル規約

- [file-layout-no-rerender](rules/file-layout-no-rerender.md) - layout.tsx は再レンダリングされない前提で設計する
- [file-loading-per-segment](rules/file-loading-per-segment.md) - 各ルートセグメントに適切な loading.tsx を配置する
- [file-error-recovery](rules/file-error-recovery.md) - error.tsx でリカバリ可能なUIを提供する
- [file-not-found-custom](rules/file-not-found-custom.md) - not-found.tsx でユーザーフレンドリーな404を作る
- [file-template-vs-layout](rules/file-template-vs-layout.md) - 再マウントが必要な場合は template.tsx を使う
- [file-server-only-guard](rules/file-server-only-guard.md) - サーバー専用モジュールには import "server-only" を付ける

### Server Actions

- [actions-validation](rules/actions-validation.md) - Server Action の入力は必ずサーバー側でバリデーションする
- [actions-auth-check](rules/actions-auth-check.md) - Server Action 内で認証・認可チェックを行う
- [actions-revalidate](rules/actions-revalidate.md) - データ変更後は適切な revalidation を実行する
- [actions-error-handling](rules/actions-error-handling.md) - Server Action のエラーはクライアントに安全に返す
- [actions-progressive-enhancement](rules/actions-progressive-enhancement.md) - JavaScript 無効でもフォームが動作するようにする

### キャッシュ戦略

- [cache-understand-layers](rules/cache-understand-layers.md) - 4つのキャッシュレイヤーを理解して設計する
- [cache-avoid-unnecessary-loading](rules/cache-avoid-unnecessary-loading.md) - ナビゲーション時に不要なローディングを出さない

### Metadata / SEO

- [metadata-generate-dynamic](rules/metadata-generate-dynamic.md) - 動的ページでは generateMetadata を使う
- [metadata-opengraph-image](rules/metadata-opengraph-image.md) - OGP画像は opengraph-image.tsx で動的生成する
- [metadata-canonical-url](rules/metadata-canonical-url.md) - canonical URL を明示的に設定する

### データ取得

- [fetching-no-route-handler-hop](rules/fetching-no-route-handler-hop.md) - Server Component から自分自身の Route Handler を呼ばない

### ルーティングパターン

- [routing-group-by-feature](rules/routing-group-by-feature.md) - Route Groups で機能単位にグルーピングする
- [routing-catch-all-carefully](rules/routing-catch-all-carefully.md) - catch-all routes の優先順位に注意する

### Proxy

- [proxy-lightweight](rules/proxy-lightweight.md) - Proxy は軽量に保つ（重い処理を入れない）
- [proxy-matcher](rules/proxy-matcher.md) - matcher で対象パスを限定する
- [proxy-no-db](rules/proxy-no-db.md) - Proxy 内でDBアクセスしない

## How to Use

個別ルールの詳細は `rules/` ディレクトリ内のファイルを参照。上記 Quick Reference のリンクから各ルールにアクセスできる。

各ルールファイルには以下が含まれる：

- ルールの説明と根拠
- Bad: 間違ったコード例
- Good: 正しいコード例
- Next.js バージョン固有の注意点
