## Proxy は軽量に保つ（重い処理を入れない）

Proxy はすべてのマッチするリクエストで実行される。重い処理を入れるとすべてのページのレスポンスが遅延する。軽量なチェックとリダイレクト/リライトに限定する。

**Bad (Proxy で重い処理):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // ❌ 外部APIへのリクエスト — レイテンシが加算される
  const user = await fetch("https://api.example.com/me", {
    headers: { Cookie: request.headers.get("cookie") || "" },
  }).then(r => r.json())

  // ❌ 重い計算処理
  const permissions = await calculateComplexPermissions(user)

  // ❌ 複雑なビジネスロジック
  if (permissions.canAccess(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/unauthorized", request.url))
}
```

**Good (軽量なチェックのみ):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value

  // ✅ トークンの有無チェックのみ（軽量）
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ✅ シンプルなヘッダー付与
  const response = NextResponse.next()
  response.headers.set("x-pathname", request.nextUrl.pathname)

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
```

```tsx
// 詳細な認可チェックは Server Component や Server Action で行う
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth() // ← ここで詳細チェック

  if (!session) redirect("/login")
  if (session.user.role !== "admin") redirect("/unauthorized")

  return <Dashboard />
}
```

**原則:**
- Proxy は「ゲートキーパー」— 通すか通さないかの判断のみ
- 詳細な認可、データ取得、ビジネスロジックは Server Component / Server Action で行う
- 外部API呼び出しが必要な場合は、JWTの署名検証のようなローカルで完結する方法を検討する
