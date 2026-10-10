## データ変更後は適切な revalidation を実行する

Server Action でデータを変更した後、関連するキャッシュを無効化しないとUIに古いデータが表示され続ける。変更の影響範囲に応じて適切な revalidation 手段を選択する。

**revalidation の手段:**

| 手段 | スコープ | 使い所 |
|------|---------|--------|
| `revalidatePath(path)` | 特定パスのキャッシュを無効化 | 1ページに影響する変更 |
| `revalidateTag(tag)` | タグ付きキャッシュを無効化 | 複数ページに影響する変更 |
| `redirect(path)` | リダイレクト（暗黙的に revalidate） | 作成後の詳細ページ遷移 |

**Bad (revalidation を忘れている):**

```tsx
"use server"

export async function updateProfile(formData: FormData) {
  await db.user.update({
    where: { id: getCurrentUserId() },
    data: { name: formData.get("name") as string },
  })
  // ❌ キャッシュが古いまま — UIに反映されない
}
```

**Good (適切な revalidation):**

```tsx
"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

// パターン1: 同じページの更新
export async function updateProfile(formData: FormData) {
  await db.user.update({
    where: { id: getCurrentUserId() },
    data: { name: formData.get("name") as string },
  })
  revalidatePath("/settings/profile")
}

// パターン2: 複数ページに影響する変更（タグベース）
export async function publishPost(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: { status: "published" },
  })
  revalidateTag("posts")       // fetch(..., { next: { tags: ["posts"] } }) のキャッシュ
  revalidateTag(`post-${postId}`)
}

// パターン3: 作成後に遷移
export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: { title: formData.get("title") as string },
  })
  revalidatePath("/posts")
  redirect(`/posts/${post.id}`)
}
```

**fetch 側でのタグ設定:**

```tsx
// Server Component
async function PostList() {
  const posts = await fetch("https://api.example.com/posts", {
    next: { tags: ["posts"] },  // ← revalidateTag("posts") で無効化される
  }).then(r => r.json())

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

**判断基準:**
- 変更が1つのページだけに影響 → `revalidatePath`
- 変更が複数のページやコンポーネントに影響 → `revalidateTag`
- 変更後に別ページに遷移 → `redirect`（遷移先は最新データで描画される）
