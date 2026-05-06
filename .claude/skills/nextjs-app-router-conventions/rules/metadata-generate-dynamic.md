## 動的ページでは generateMetadata を使う

動的ルート（`[id]`, `[slug]` など）では `generateMetadata` を使い、ページ内容に合わせたタイトルやディスクリプションを動的に生成する。これによりSEOとSNSシェア時の表示が最適化される。

**Bad (静的な metadata を動的ページに使う):**

```tsx
// app/posts/[id]/page.tsx

// ❌ すべての記事ページで同じタイトルになる
export const metadata = {
  title: "記事詳細",
  description: "記事の詳細ページです",
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  return <article>{post.title}</article>
}
```

**Good (generateMetadata でデータに基づくメタ情報):**

```tsx
// app/posts/[id]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return { title: "記事が見つかりません" }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) notFound()

  return <article>{post.title}</article>
}
```

**原則:**
- `generateMetadata` 内の `fetch` は page コンポーネントと同じリクエストなら自動的に重複排除される
- 親レイアウトの metadata はマージされる — 子で上書きしたいフィールドだけ指定する
- `title.template` を親で設定すると子のタイトルに接尾辞を自動付与できる
- `generateMetadata` は Server Component でのみ使用可能
