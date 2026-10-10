## 初期データ取得に useEffect を使わない

ページの初期表示に必要なデータを `useEffect` で取得すると、JS ロード → ハイドレーション → fetch → レンダリングのウォーターフォールが発生する。Server Component の async/await か、必要に応じて SWR/TanStack Query を使う。

**Bad (useEffect でのウォーターフォール):**

```tsx
"use client"

export function Dashboard() {
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // JS ロード完了後にようやく fetch が始まる
    fetchStats().then(setStats)
    fetchProjects().then(setProjects)
  }, [])

  if (!stats || !projects.length) return <Loading />

  return (
    <div>
      <StatsPanel stats={stats} />
      <ProjectList projects={projects} />
    </div>
  )
}
```

**Good (Server Component で並列取得):**

```tsx
// Server Component
export default async function Dashboard() {
  const [stats, projects] = await Promise.all([
    fetchStats(),
    fetchProjects(),
  ])

  return (
    <div>
      <StatsPanel stats={stats} />
      <ProjectList projects={projects} />
    </div>
  )
}
```

**Good (Suspense で段階的ストリーミング):**

```tsx
// Server Component
export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsPanel />
      </Suspense>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}

async function StatsPanel() {
  const stats = await fetchStats()
  return <div>{/* ... */}</div>
}
```

**例外（useEffect/SWR が適切なケース）:**
- ユーザーアクションに応じた動的データ（検索、フィルタ）
- ポーリング/リアルタイム更新が必要なデータ
- 認証状態に依存しサーバーで取得できないデータ
