## not-found.tsx でユーザーフレンドリーな404を作る

`not-found.tsx` は `notFound()` 関数が呼ばれた時、またはマッチしないURLにアクセスされた時に表示される。デフォルトの404ページではなく、ユーザーが次のアクションを取れるカスタムUIを提供する。

**Bad (デフォルト404に頼る):**

```tsx
// app/posts/[id]/page.tsx
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  // ❌ post が null の場合、何も表示されないか壊れる
  return <article>{post.title}</article>
}
```

**Good (notFound() と not-found.tsx の連携):**

```tsx
// app/posts/[id]/page.tsx
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound() // ← not-found.tsx を表示
  }

  return <article>{post.title}</article>
}
```

```tsx
// app/posts/[id]/not-found.tsx
import Link from "next/link"

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-bold">記事が見つかりません</h2>
      <p className="text-gray-600">
        この記事は削除されたか、URLが間違っている可能性があります。
      </p>
      <Link
        href="/posts"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        記事一覧に戻る
      </Link>
    </div>
  )
}
```

**原則:**
- データ取得の結果が存在しない場合は `notFound()` を呼ぶ
- `not-found.tsx` はルートセグメントごとに配置でき、そのセグメントのレイアウト内で表示される
- ナビゲーションリンクや検索フォームなど、ユーザーの次のアクションを提示する
- `app/not-found.tsx` がグローバルのフォールバックになる
