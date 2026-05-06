## Server Component から自分自身の Route Handler を呼ばない

Server Component 内で `fetch("/api/...")` を呼ぶと、同じサーバー上の別エンドポイントに対して不要なHTTPラウンドトリップが発生する。Server Component では直接データベースやサービスにアクセスできる。

**Bad (自分自身のAPIルートを呼んでいる):**

```tsx
// app/api/users/route.ts
export async function GET() {
  const users = await db.user.findMany()
  return Response.json(users)
}

// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  // ❌ 同じサーバー内で HTTP ラウンドトリップが発生
  const res = await fetch("http://localhost:3000/api/users")
  const users = await res.json()

  return <UserList users={users} />
}
```

**Good (直接データソースにアクセス):**

```tsx
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  // ✅ 直接DBにアクセス — HTTP オーバーヘッドなし
  const users = await db.user.findMany()

  return <UserList users={users} />
}
```

**Good (共通ロジックを関数として共有):**

```tsx
// lib/users.ts — Server Component と Route Handler の両方から使える
export async function getUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
  })
}

// app/users/page.tsx (Server Component)
import { getUsers } from "@/lib/users"

export default async function UsersPage() {
  const users = await getUsers()
  return <UserList users={users} />
}

// app/api/users/route.ts (外部クライアント向けAPI)
import { getUsers } from "@/lib/users"

export async function GET() {
  const users = await getUsers()
  return Response.json(users)
}
```

**Route Handler が必要なケース:**
- 外部クライアント（モバイルアプリ等）からのアクセス
- Webhook の受け口
- Client Component からの動的データ取得（SWR/TanStack Query 経由）
- ファイルダウンロードなど特殊なレスポンス形式
