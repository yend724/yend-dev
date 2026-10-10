## Proxy 内でDBアクセスしない

Proxy はすべてのマッチするリクエストで実行される。すべてのリクエストでDB接続が発生するとパフォーマンスが大幅に劣化する。

**Bad (Proxy でDB接続):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value

  // ❌ 全リクエストでDBアクセス — 遅延の原因
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ❌ さらにDB参照して権限チェック
  const permissions = await db.permission.findMany({
    where: { userId: session.userId },
  })

  return NextResponse.next()
}
```

**Good (JWT検証 + 詳細チェックは Server Component で):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // ✅ JWT の署名検証はローカルで完結（DBアクセス不要）
    const { payload } = await jwtVerify(token, secret)

    // ✅ ヘッダーにユーザー情報を付与（下流で利用）
    const response = NextResponse.next()
    response.headers.set("x-user-id", payload.sub as string)
    response.headers.set("x-user-role", payload.role as string)
    return response
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
```

```tsx
// 詳細な権限チェックは Server Component で
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const headersList = await headers()
  const role = headersList.get("x-user-role")

  // ✅ DB参照が必要な権限チェックはここで
  if (role !== "admin") {
    redirect("/unauthorized")
  }

  const data = await db.adminData.findMany()
  return <AdminDashboard data={data} />
}
```

**原則:**
- Proxy はステートレスな検証のみ（JWT検証、Cookie有無チェック）
- DB接続が必要な処理は Server Component、Route Handler、Server Action で行う
- Proxy ではヘッダーやCookieに情報を付与し、下流で参照するアーキテクチャが効果的
