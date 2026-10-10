## fallback は意図を持って選択する

Suspense の fallback は「何でもスピナー」ではなく、状況に応じて適切なものを選ぶ。スケルトン UI が理想だが、コストに見合わない場面もある。重要なのは、レイアウトシフトの影響とユーザー体験を考慮して意図的に選択すること。

**Bad (汎用スピナーのみ):**

```tsx
// ❌ レイアウトシフトが発生し、何が読み込まれているか不明
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleList />
    </Suspense>
  )
}

function Spinner() {
  return <div className="flex justify-center"><div className="spinner" /></div>
}
```

**Good (コンテンツ構造に合ったスケルトン):**

```tsx
export default function Page() {
  return (
    <Suspense fallback={<ArticleListSkeleton />}>
      <ArticleList />
    </Suspense>
  )
}

function ArticleListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 rounded mb-1" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

// 実際のコンテンツとスケルトンが同じレイアウト構造を持つ
async function ArticleList() {
  const articles = await fetchArticles()
  return (
    <div className="space-y-4">
      {articles.map(article => (
        <div key={article.id}>
          <h2 className="text-lg font-bold">{article.title}</h2>
          <p>{article.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

**スケルトン UI を用意すべき場面:**
- ページの主要コンテンツ領域（ファーストビューに表示される部分）
- レイアウトシフトが目立つ大きなコンテンツブロック
- ユーザーが頻繁にアクセスする画面

**スピナーやシンプルな fallback で十分な場面:**
- モーダルやドロワー内のコンテンツ
- 画面の下部など、ファーストビュー外の領域
- プロトタイプや初期開発段階
- コンテンツの構造が動的で予測しづらい場合

**fallback を選ぶときの考え方:**
- レイアウトシフトの影響が大きいか → スケルトンを検討
- コンテンツのサイズが予測可能か → 可能ならスケルトン、不可能なら固定高さのコンテナ + スピナー
- フレームワークが提供するルートレベルのローディング機構があれば活用する
