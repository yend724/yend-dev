# YEND.DEV

> YENDの実験場

個人ポートフォリオサイト・ブログサイトです。プログラミング、数学、技術に関する記事を投稿し、個人プロジェクトや読書ログを公開しています。

🔗 **サイトURL**: [https://yend.dev/](https://yend.dev/)

## 📋 主な機能

- **ブログ**: プログラミング・数学・技術に関する記事
- **プロジェクト紹介**: 自作ライブラリ・ウェブアプリ・プレイグラウンドの紹介
- **読書ログ**: 技術書を中心とした読書記録
- **資格情報**: 応用情報技術者試験、情報処理安全確保支援士試験合格の記録
- **RSSフィード**: 記事の更新通知対応

## 🛠 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) 15.3.5
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **コンテンツ管理**: [MDX](https://mdxjs.com/)
- **コード品質**: ESLint, Prettier
- **バリデーション**: [Valibot](https://valibot.dev/)
- **数式表示**: KaTeX
- **シンタックスハイライト**: Shiki
- **目次生成**: Tocbot

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18 以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yend724/yend-dev.git
cd yend-dev

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動したら [http://localhost:3000](http://localhost:3000) でサイトを確認できます。

### 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start

# リント実行
npm run lint

# リント修正
npm run lint:fix
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (home)/            # ホームページレイアウト
│   └── posts/             # ブログ記事ページ
├── entities/              # エンティティレイヤー
│   ├── article/           # 記事関連
│   ├── post/              # ブログ投稿関連
│   ├── project/           # プロジェクト関連
│   └── ...
├── features/              # 機能レイヤー
├── shared/                # 共有レイヤー
│   ├── config/            # 設定ファイル
│   ├── lib/               # ユーティリティ関数
│   └── ui/                # 共通UIコンポーネント
├── views/                 # ページビューコンポーネント
└── resources/             # リソース
    ├── posts/             # MDXブログ記事
    └── books/             # 読書ログデータ
```

## 📝 ブログ記事の追加

ブログ記事は `src/resources/posts/` ディレクトリにMDXファイルとして保存されます。

```markdown
---
title: 記事のタイトル
date: 2025-01-01T00:00:00
tags:
  - Tag1
  - Tag2
draft: false
---

記事の内容をここに書きます。
```

## 🔧 設定

- **サイト設定**: `src/shared/config/site/index.ts`
- **プロジェクト情報**: `src/shared/config/project/index.ts`
- **ソーシャルリンク**: `src/shared/config/social/index.ts`
- **資格情報**: `src/shared/config/certification/index.ts`

## 📚 ライセンス

このプロジェクトのライセンスについては、作者にお問い合わせください。

## 🔗 リンク

- **作者**: YEND ([@yend724](https://github.com/yend724))
- **SNS**: [X](https://x.com/yend724) | [Zenn](https://zenn.dev/yend724) | [Qiita](https://qiita.com/yend724)
- **その他**: [CodePen](https://codepen.io/yend24) | [mixi2](https://mixi.social/@yend724)
