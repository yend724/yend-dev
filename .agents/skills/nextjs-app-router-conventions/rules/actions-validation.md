## Server Action の入力は必ずサーバー側でバリデーションする

Server Action はパブリックなHTTPエンドポイントとして公開される。クライアント側のバリデーションはUX目的であり、セキュリティを保証しない。サーバー側で必ず入力を検証する。

**Bad (クライアント側バリデーションのみ):**

```tsx
// actions.ts
"use server"

export async function createPost(formData: FormData) {
  // ❌ クライアントで検証済みだと信頼している
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  await db.post.create({ data: { title, content } })
}
```

**Good (サーバー側で必ずバリデーション):**

```tsx
// actions.ts
"use server"

import { z } from "zod"

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
})

export async function createPost(formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db.post.create({ data: parsed.data })
  revalidatePath("/posts")
}
```

**useActionState と組み合わせるパターン:**

```tsx
// actions.ts
"use server"

type ActionState = {
  errors?: { title?: string[]; content?: string[] }
  message?: string
}

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  await db.post.create({ data: parsed.data })
  revalidatePath("/posts")
  return { message: "Post created" }
}
```

**原則:**
- 全ての入力を「信頼できないもの」として扱う
- `as string` のようなキャストではなく、スキーマバリデーションを使う
- エラーメッセージは内部情報を漏らさない
- クライアント側バリデーションはUX改善のために追加で行う（セキュリティの代替にはしない）
