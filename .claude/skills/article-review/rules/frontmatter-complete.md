## Frontmatter の必須項目を網羅する

ブログ記事 MDX の frontmatter には以下が必要。欠けがないか、値が形骸化していないか確認する。

- `title` — 記事タイトル
- `date` — `YYYY-MM-DDTHH:MM:SS` 形式の日時
- `description` — 記事内容を要約する 1〜2 文(詳細は [content-description-quality](content-description-quality.md))
- `tags` — 関連タグの配列(最低 1 つ)
- `draft` — 公開状態を示す boolean(公開時は `false`)

**Bad(欠落あり):**

```yaml
---
title: 記事タイトル
tags:
  - SomeTag
---
```

**Good:**

```yaml
---
title: 記事タイトル
date: 2025-01-01T12:00:00
description: 記事の内容を1〜2文で要約した説明文。
tags:
  - SomeTag
draft: false
---
```

**チェック観点:**

- 公開予定の記事で `draft: true` のまま放置されていないか
- `date` のフォーマット(`YYYY-MM-DDTHH:MM:SS`)が他記事と揃っているか
- `tags` が記事内容を反映しているか / 表記ゆれ(`TypeScript` と `typescript` 等)がないか
- `title` がファイル名のスラグと意味的に一致しているか
