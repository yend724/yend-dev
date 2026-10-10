## canonical URL を明示的に設定する

同一コンテンツに複数のURLでアクセスできる場合（クエリパラメータ、www有無、トレイリングスラッシュ等）、検索エンジンは評価を分散させる。`canonical` URL を明示的に設定して正規のURLを示す。

**Bad (canonical 未設定):**

```tsx
// ❌ /products?sort=price と /products?sort=name が別ページとしてインデックスされる
// ❌ 重複コンテンツとして評価が分散する
export const metadata = {
  title: "商品一覧",
}
```

**Good (canonical URL を設定):**

```tsx
// app/products/page.tsx
import { Metadata } from "next"

const BASE_URL = "https://example.com"

export const metadata: Metadata = {
  title: "商品一覧",
  alternates: {
    canonical: `${BASE_URL}/products`,
  },
}

export default function ProductsPage() {
  return <div>{/* ... */}</div>
}
```

```tsx
// app/posts/[slug]/page.tsx — 動的ページでの canonical
import { Metadata } from "next"

const BASE_URL = "https://example.com"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    alternates: {
      canonical: `${BASE_URL}/posts/${slug}`,
      languages: {
        "en": `${BASE_URL}/en/posts/${slug}`,
        "ja": `${BASE_URL}/ja/posts/${slug}`,
      },
    },
  }
}
```

**原則:**
- すべてのインデックス対象ページに `alternates.canonical` を設定する
- クエリパラメータ（ソート、フィルタ、ページネーション）は canonical から除外するのが基本
- 多言語サイトでは `alternates.languages` で hreflang も設定する
- `BASE_URL` は環境変数から取得し、`next.config.js` の `metadataBase` でも設定可能
- ページネーションの各ページはそれぞれ固有の canonical を持つ（自己参照 canonical）
