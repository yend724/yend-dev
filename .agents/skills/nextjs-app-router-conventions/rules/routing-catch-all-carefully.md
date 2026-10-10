## catch-all routes の優先順位に注意する

catch-all segments (`[...slug]`) や optional catch-all (`[[...slug]]`) は柔軟だが、他のルートとの優先順位を理解しないと意図しないマッチが発生する。Next.js のルートマッチングは具体的なルートを優先する。

**Bad (catch-all が他のルートを飲み込む):**

```
app/
├── docs/
│   ├── [[...slug]]/
│   │   └── page.tsx      ← /docs, /docs/a, /docs/a/b すべてマッチ
│   └── getting-started/
│       └── page.tsx      ← ❌ ここに到達しない可能性
```

**Good (具体的なルートと catch-all の共存):**

```
app/
├── docs/
│   ├── page.tsx                 ← /docs（インデックス）
│   ├── getting-started/
│   │   └── page.tsx             ← /docs/getting-started（具体的ルート優先）
│   ├── api-reference/
│   │   └── page.tsx             ← /docs/api-reference（具体的ルート優先）
│   └── [category]/
│       └── [slug]/
│           └── page.tsx         ← /docs/:category/:slug
```

```tsx
// catch-all を使う正当なケース: CMSコンテンツのように深さが不定
// app/docs/[...slug]/page.tsx
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string[] }>
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params
  // slug = ["guides", "authentication", "oauth"] のように配列で受け取る
  const path = slug.join("/")
  const doc = await getDocByPath(path)

  if (!doc) notFound()

  return <article dangerouslySetInnerHTML={{ __html: doc.html }} />
}

// 事前生成するパスを定義
export async function generateStaticParams() {
  const docs = await getAllDocs()
  return docs.map((doc) => ({
    slug: doc.path.split("/"),
  }))
}
```

**判断基準:**
- Next.js のルート優先順位: 静的ルート > 動的ルート (`[id]`) > catch-all (`[...slug]`)
- 具体的なページが存在する場合は、個別のルートファイルを作成する
- catch-all は深さが不定なコンテンツ（CMS、ドキュメント）に限定して使う
- `[[...slug]]` (optional) はインデックスページも含めてマッチする — 意図的に使う
- ルーティングの問題が起きたら `next.config.js` の `logging` で確認する
