## データ取得はそれを使うコンポーネントにコロケーションする

データ取得をトップレベルページに集約して props で下に流す「トップダウンフェッチ」は、コンポーネントの再利用性を下げ、不要なデータの伝播を生む。各 Server Component が自分に必要なデータを自分で取得する。

**Bad (トップレベルで全データ取得 → バケツリレー):**

```tsx
// DashboardPage.tsx
export default async function DashboardPage() {
  const user = await getUser()
  const stats = await getStats()
  const notifications = await getNotifications()
  const projects = await getProjects()

  return (
    <div>
      <Header user={user} notifications={notifications} />
      <StatsPanel stats={stats} />
      <ProjectList projects={projects} user={user} />
    </div>
  )
}
```

**Good (各コンポーネントが自分のデータを取得):**

```tsx
// DashboardPage.tsx
export default function DashboardPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<StatsSkeleton />}>
        <StatsPanel />
      </Suspense>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}

// components/StatsPanel.tsx (Server Component)
async function StatsPanel() {
  const stats = await getStats()
  return <div>{/* stats を表示 */}</div>
}

// components/ProjectList.tsx (Server Component)
async function ProjectList() {
  const projects = await getProjects()
  return <ul>{/* projects を表示 */}</ul>
}
```

**メリット:**
- 各コンポーネントが独立して再利用可能
- Suspense と組み合わせて並列ストリーミング可能
- 不要なデータを不要な場所に渡さない
- コンポーネント削除時にデータ取得も一緒に消える

**重複リクエストの心配は不要:**
- React は同一レンダリング内の `fetch` を自動的に dedup する
- `React.cache()` でさらに明示的にキャッシュ可能

```tsx
// lib/data.ts
import { cache } from "react"

export const getUser = cache(async () => {
  return db.user.findUnique({ where: { id: getCurrentUserId() } })
})

// 複数のコンポーネントから getUser() を呼んでも1回しか実行されない
```
