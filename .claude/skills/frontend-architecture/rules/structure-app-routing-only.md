## app/ はルーティングとレイアウト構成のみに���う

`app/` ディレクトリはルーティングとレイアウトのみを担当する。ビジネスロジック・UI コンポーネント・型定義は `features/` に置き、ページコンポーネントは feature からインポートして組み立てるだけにする。

ページレベルのレイアウト構成（グリッド配置、余白の調整など）は `app/` に書いてよい。

**Bad:**

```tsx
// ❌ app/ にビジネスロジックや UI を直接書く
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const stats = await fetchStats()
  const activities = await fetchRecentActivities()

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-bold">統計</h2>
        <p>{stats.totalUsers}人</p>
        {/* 大量の UI コードが続く... */}
      </div>
    </div>
  )
}
```

**Good:**

```tsx
// ✅ app/ はルーティング + レイアウト構成のみ
// src/app/dashboard/page.tsx
import { StatsCard, RecentActivity } from "@/features/dashboard"

export default async function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard />
      <RecentActivity />
    </div>
  )
}
```
