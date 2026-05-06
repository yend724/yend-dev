## 複数の Server Component を Client に渡すには名前付き slots を使う

`children` は1つのスロットだが、複数の Server Component を Client Component の異なる位置に配置したい場合は、名前付き props（slots）を使う。

**Bad (全てを Client Component 内で管理):**

```tsx
"use client"

export function DashboardLayout() {
  return (
    <div className="grid">
      <aside><Sidebar /></aside>     {/* これらが全て Client に */}
      <main><MainContent /></main>
      <aside><RightPanel /></aside>
    </div>
  )
}
```

**Good (slots パターン):**

```tsx
// DashboardPage.tsx (Server Component)
import { DashboardLayout } from "./DashboardLayout"
import { Sidebar } from "./Sidebar"
import { MainContent } from "./MainContent"
import { RightPanel } from "./RightPanel"

export default function DashboardPage() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}           {/* Server Component */}
      main={<MainContent />}          {/* Server Component */}
      rightPanel={<RightPanel />}     {/* Server Component */}
    />
  )
}

// components/DashboardLayout.tsx
"use client"

interface DashboardLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  rightPanel: React.ReactNode
}

export function DashboardLayout({ sidebar, main, rightPanel }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="grid">
      {sidebarOpen && <aside>{sidebar}</aside>}
      <main>{main}</main>
      <aside>{rightPanel}</aside>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle Sidebar
      </button>
    </div>
  )
}
```

**children と slots の使い分け:**

| ケース | 使うパターン |
|--------|-------------|
| 単一の挿入ポイント | `children` |
| 複数の挿入ポイント | 名前付き slots |
| ヘッダー+コンテンツ | `header` + `children` |
