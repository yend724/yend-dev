## Server Action 内で認証・認可チェックを行う

Server Action はHTTPエンドポイントとして公開されるため、UIレベルの制御だけでは不十分。Action 内で必ず認証（誰か）と認可（権限があるか）を検証する。

**Bad (認証チェックがない):**

```tsx
"use server"

export async function deletePost(postId: string) {
  // ❌ 誰でも呼べてしまう — ボタンを非表示にしても直接リクエスト可能
  await db.post.delete({ where: { id: postId } })
}
```

**Good (認証・認可チェックを含む):**

```tsx
"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function deletePost(postId: string) {
  const session = await auth()

  // 認証チェック
  if (!session?.user) {
    redirect("/login")
  }

  // 認可チェック — 投稿者本人 or 管理者のみ削除可能
  const post = await db.post.findUnique({ where: { id: postId } })

  if (!post) {
    throw new Error("Post not found")
  }

  if (post.authorId !== session.user.id && session.user.role !== "admin") {
    throw new Error("Forbidden")
  }

  await db.post.delete({ where: { id: postId } })
  revalidatePath("/posts")
}
```

**原則:**
- Server Action は公開エンドポイントと同等 — UIの表示/非表示に依存しない
- 認証: セッション/トークンの有無を確認する
- 認可: リソースに対する操作権限を確認する
- 共通の認証ロジックはヘルパー関数に抽出して再利用する
- 認証失敗時は `redirect`、認可失敗時は適切なエラーを返す
