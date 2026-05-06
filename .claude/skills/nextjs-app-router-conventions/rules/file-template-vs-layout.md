## 再マウントが必要な場合は template.tsx を使う

`layout.tsx` はナビゲーション間で状態を保持し再レンダリングしない。一方 `template.tsx` はナビゲーションごとに新しいインスタンスを生成する。ページ遷移のたびにリセットしたい状態やエフェクトがある場合は `template.tsx` を使う。

**Bad (layout で毎回実行したいエフェクトを書く):**

```tsx
// app/dashboard/layout.tsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ❌ pathname の変化を監視する回りくどい方法
  useEffect(() => {
    analytics.pageView(pathname)
  }, [pathname])

  return <div>{children}</div>
}
```

**Good (template でナビゲーションごとに実行):**

```tsx
// app/dashboard/template.tsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ✅ ナビゲーションごとに新しいインスタンスが作られ、useEffect が実行される
  useEffect(() => {
    analytics.pageView(pathname)
  }, [])

  return <div>{children}</div>
}
```

**判断基準:**
- 共有UIを保持したい（サイドバー、ナビ）→ `layout.tsx`
- ナビゲーションごとにステートをリセットしたい → `template.tsx`
- ページ遷移アニメーション（enter/exit）→ `template.tsx`
- ページごとのログ/計測を正確に取りたい → `template.tsx`
- `layout.tsx` と `template.tsx` は共存可能 — layout が外側、template が内側にラップされる
