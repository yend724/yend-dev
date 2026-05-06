## layout.tsx は再レンダリングされない前提で設計する

`layout.tsx` はルート間のナビゲーション時に再レンダリングされない（状態が保持される）。この特性を理解して設計しないと、データの不整合やUIの不具合が生じる。

**Key Facts:**
- layout は子ルートが変わっても再レンダリングされない
- layout 内の `fetch` はナビゲーション時に再実行されない
- 再マウントが必要な場合は `template.tsx` を使う

**Bad (layout 内でナビゲーション依存のデータ取得):**

```tsx
// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  // ❌ サブページ間のナビゲーションでは再実行されない
  const notifications = await getUnreadNotifications()

  return (
    <div>
      <nav>
        <NotificationBadge count={notifications.length} />
      </nav>
      {children}
    </div>
  )
}
```

**Good (リアルタイム性が必要なデータは Client Component で取得):**

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        <NotificationBadge />  {/* Client Component で polling */}
      </nav>
      {children}
    </div>
  )
}

// components/NotificationBadge.tsx
"use client"

export function NotificationBadge() {
  // ✅ Client 側でリアルタイム更新
  const { data } = useSWR("/api/notifications/count", fetcher, {
    refreshInterval: 30000,
  })

  return <span>{data?.count ?? 0}</span>
}
```

**layout.tsx に適した内容:**
- 静的なナビゲーション構造
- 共通の Provider ラッパー
- ページ遷移しても変わらないUI（サイドバー等）

**layout.tsx に不適切な内容:**
- ページごとに変わるべきデータ
- 頻繁に更新が必要なデータ
- URL パラメータに依存する表示（`searchParams` は layout で使えない）
