## Context Provider は専用の Client Component でラップする

Context API は Client Component でしか使えない。Layout や Page に直接 Provider を置くとファイル全体が Client Component になる。Provider を専用の Client Component として切り出し、children を受け取る形にする。

**Bad (Layout 全体が Client Component になる):**

```tsx
"use client"

// ルートレイアウトが丸ごと Client Component に
export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <html>
          <body>{children}</body>
        </html>
      </AuthProvider>
    </ThemeProvider>
  )
}
```

**Good (Provider を専用コンポーネントに分離):**

```tsx
// RootLayout.tsx (Server Component のまま)
import { Providers } from "./Providers"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// Providers.tsx
"use client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
```

**重要なポイント:**
- `children` として渡された Server Component はサーバーでレンダリングされる。Client Component でラップしてもクライアント化されない
- Provider の初期値にサーバーサイドのデータが必要な場合は、Server Component で取得して props として渡す

**Server → Provider へのデータ受け渡し:**

```tsx
// RootLayout.tsx (Server Component)
import { getSession } from "./lib/auth"
import { Providers } from "./Providers"

export default async function RootLayout({ children }) {
  const session = await getSession()

  return (
    <html>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
```
