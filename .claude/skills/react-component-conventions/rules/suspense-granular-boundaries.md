## Suspense 境界は可能な限り細粒度に配置する

1つの Suspense で複数の async コンポーネントを囲むと、全てのデータ取得が完了するまで fallback が表示され続ける。独立したデータソースごとに Suspense を分けることで、準備できたものから順に表示できる。

**Bad (ページ全体を1つの Suspense で囲む):**

```tsx
// 全てのデータが揃うまでページ全体がローディング
export default function Dashboard() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <DashboardContent />
    </Suspense>
  )
}

async function DashboardContent() {
  const stats = await fetchStats()           // 100ms
  const feed = await fetchActivityFeed()     // 2000ms ← これがボトルネック
  const notifications = await fetchNotifications()  // 300ms

  return (
    <div>
      <StatsPanel stats={stats} />
      <ActivityFeed feed={feed} />
      <Notifications notifications={notifications} />
    </div>
  )
}
```

**Good (独立したデータごとに Suspense を分割):**

```tsx
export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsPanel />          {/* 100ms で表示 */}
      </Suspense>
      <Suspense fallback={<FeedSkeleton />}>
        <ActivityFeed />        {/* 2000ms で表示（他をブロックしない） */}
      </Suspense>
      <Suspense fallback={<NotificationsSkeleton />}>
        <Notifications />      {/* 300ms で表示 */}
      </Suspense>
    </div>
  )
}

async function StatsPanel() {
  const stats = await fetchStats()
  return <div>{/* ... */}</div>
}

async function ActivityFeed() {
  const feed = await fetchActivityFeed()
  return <div>{/* ... */}</div>
}
```

**配置の判断基準:**
- データソースが独立している → 別々の Suspense
- データに依存関係がある（A を取得してから B を取得）→ 同じ Suspense 内で直列
- UIとして同時に表示されるべき → 同じ Suspense
- レスポンス時間に大きな差がある → 別々の Suspense
