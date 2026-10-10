## 独立したデータソースは別々の Suspense で並列ストリーミングする

React の Suspense と Server Component を組み合わせると、各 async コンポーネントが独立して並列にデータを取得・ストリーミングされる。1つのコンポーネント内で複数の await を直列に実行すると、不要なウォーターフォールが発生する。

**Bad (直列 await でウォーターフォール):**

```tsx
// ❌ 各 await が前の完了を待つ → 合計 100+2000+500 = 2600ms
async function Dashboard() {
  const user = await fetchUser()               // 100ms
  const analytics = await fetchAnalytics()     // 2000ms
  const alerts = await fetchAlerts()           // 500ms

  return (
    <div>
      <UserProfile user={user} />
      <AnalyticsChart data={analytics} />
      <AlertList alerts={alerts} />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}
```

**Good (独立コンポーネントで並列ストリーミング):**

```tsx
// ✅ 各コンポーネントが独立して並列フェッチ → 最大 2000ms で全完了
export default function Page() {
  return (
    <div>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile />          {/* 100ms で表示 */}
      </Suspense>
      <Suspense fallback={<AnalyticsChartSkeleton />}>
        <AnalyticsChart />       {/* 2000ms で表示 */}
      </Suspense>
      <Suspense fallback={<AlertListSkeleton />}>
        <AlertList />            {/* 500ms で表示 */}
      </Suspense>
    </div>
  )
}

async function UserProfile() {
  const user = await fetchUser()
  return <div>{/* ユーザー情報 */}</div>
}

async function AnalyticsChart() {
  const data = await fetchAnalytics()
  return <div>{/* チャート */}</div>
}

async function AlertList() {
  const alerts = await fetchAlerts()
  return <div>{/* アラート一覧 */}</div>
}
```

**判断基準:**
- データ間に依存関係がない → 別コンポーネント + 別 Suspense で並列化
- A のレスポンスが B のリクエストに必要 → 同じコンポーネント内で直列 await
- 同時に表示されるべきUI（例: ユーザー名とアバター）→ 同じ Suspense 内
- `Promise.all` よりも Suspense 分割を優先する（部分表示が可能になるため）
