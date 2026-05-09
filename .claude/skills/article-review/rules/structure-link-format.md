## リンクは markdown 記法で書き、生 URL を本文に置かない

本文中の URL は markdown のリンク記法 `[表示テキスト](URL)` で書く。生 URL を貼ると、URL がそのままレンダリングされて視覚的に重く、また「そのリンクが何を指しているか」を読者に明示できない。

**Bad(生 URL):**

```md
詳しくはhttps://example.com/docs/getting-started/にある。
```

**Good:**

```md
詳しくは[Getting Started](https://example.com/docs/getting-started/)にある。
```

**チェック観点:**

- 表示テキストはページ名や説明的な短文(記事タイトル、見出し名など)にする
- 「こちら」「ここ」のような無情報な表示テキストを避ける
- 引用元へのリンクは引用直後に `— [Source Name](URL)` 形式で添える(既存記事のスタイルに合わせる)
- `https://...` がそのまま本文に露出していないか
- リンク先が想定どおりのページか(URL の typo / 古いパス / アンカーずれ)
