## matcher で対象パスを限定する

`config.matcher` を設定しないと Proxy はすべてのリクエスト（静的ファイル含む）で実行される。対象パスを明示的に限定することで、不要な処理を避けパフォーマンスを維持する。

**Bad (matcher 未設定):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ❌ 画像、CSS、JS、favicon すべてのリクエストで実行される
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
// matcher が無い!
```

**Good (matcher で対象を限定):**

```tsx
// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 認証が必要なパスのみ
    "/dashboard/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
  ],
}
```

```tsx
// より高度な matcher パターン
export const config = {
  matcher: [
    // 静的ファイルと _next を除外する正規表現パターン
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
```

```tsx
// 条件分岐が必要な場合は matcher + 内部ロジック
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // i18n リダイレクト
  if (pathname === "/") {
    const locale = request.headers.get("accept-language")?.split(",")[0] || "ja"
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // 認証チェック
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("session")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
```

**原則:**
- 静的アセット（`_next/static`, 画像, favicon）は必ず除外する
- matcher は配列で複数パターンを指定できる
- `:path*` で子パスすべてにマッチ
- 正規表現パターンも使用可能（先頭に `/` が必要）
- matcher がないとすべてのリクエストで Proxy が実行され、パフォーマンスに影響する
