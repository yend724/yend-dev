---
name: article-review
description: Self-review skill for MDX blog articles. Given an article path, the skill reads the file and reports specific issues at their line locations, spanning frontmatter integrity, Japanese-English typography, markdown structure, and content quality. Auto-triggers when the user asks to review an article file path or when editing files matching `packages/resources/posts/**/*.mdx`.
---

# Article Review

`packages/resources/posts/**/*.mdx` のブログ記事をセルフレビューするためのチェック項目集。記事のパスを受け取り、各ルールに沿って点検する。

## When to Apply

- 記事ファイルのパスを渡されてレビュー（あるいは類似の指示）を依頼されたとき
- 次のパターンに一致するファイルを新規作成・更新したとき
  - `packages/resources/posts/**/*.mdx`

## Rule Categories

| Category | Prefix |
| -------- | ------ |
| Frontmatter | `frontmatter-` |
| 表記 | `typography-` |
| 構造 | `structure-` |
| 内容 | `content-` |

## Quick Reference

### Frontmatter

- [frontmatter-complete](rules/frontmatter-complete.md) - title / date / description / tags / draft が揃っているか
- [frontmatter-metadata-quality](rules/frontmatter-metadata-quality.md) - title と description が記事内容を正確に表し、本文と整合しているか

### 表記

- [typography-jp-en](rules/typography-jp-en.md) - 日本語と英語(ASCII)の間に半角スペースを入れない
- [typography-terminology-consistency](rules/typography-terminology-consistency.md) - 同じ概念を同じ用語で書き、固有名詞・訳語の表記揺れをなくす

### 構造

- [structure-heading-hierarchy](rules/structure-heading-hierarchy.md) - 見出しは h2 から始め、レベルを飛ばさない
- [structure-code-block-language](rules/structure-code-block-language.md) - コードブロックには言語識別子を必ず付ける
- [structure-link-format](rules/structure-link-format.md) - リンクは markdown 記法で書き、生 URL を本文に置かない

### 内容

- [content-tone-plain-form](rules/content-tone-plain-form.md) - 文体は「である調(常体)」を基本とし、「ですます調」は使わない
- [content-technical-accuracy](rules/content-technical-accuracy.md) - 公式仕様との一致 / 環境・バージョンの明記による再現可能性 / 事実と推測の区別
- [content-flow-readability](rules/content-flow-readability.md) - 構成として理解しやすく、節同士・冒頭結論間に矛盾がないか
- [content-prose-quality](rules/content-prose-quality.md) - 日本語として正しく適切な表現で、冗長な表現がないか
- [content-value-originality](rules/content-value-originality.md) - 記事に独自の価値があり、コピペや無断転載で著作権を侵害していないか
- [content-security-privacy](rules/content-security-privacy.md) - APIキー・個人情報の混入チェック、危険な設定を紹介する際の注意書き

## How to Use

レビュー対象の MDX パスを受け取ったら、以下の順で点検する。

1. Frontmatter の必須項目を確認(`frontmatter-*`)
2. 表記ルールに照らして本文を読む(`typography-*`)
3. 構造(見出し / コードブロック / リンク)が規約に沿っているか確認(`structure-*`)
4. 内容(文体 / description の質)の整合性を確認(`content-*`)

各観点で不適合があれば、**ファイル内の行番号と該当箇所**を具体的に示しつつ指摘する。修正提案は記事の文体に合わせて書く。
