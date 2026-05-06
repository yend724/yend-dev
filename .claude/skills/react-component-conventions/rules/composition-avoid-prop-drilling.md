## 深い props 受け渡しより Composition で解決する

中間コンポーネントが自身では使わない props をただ下に渡すだけの「prop drilling」は、変更に弱く可読性も低い。Composition パターンでコンポーネントを組み立てることで、データを必要な場所に直接渡せる。

**Bad (props を何層も受け渡し):**

```tsx
// ❌ Page → Layout → Sidebar → UserMenu と props が貫通
function Page({ user }: { user: User }) {
  return <Layout user={user} />
}

function Layout({ user }: { user: User }) {
  return (
    <div>
      <Sidebar user={user} />  {/* Layout は user を使わない */}
      <Main />
    </div>
  )
}

function Sidebar({ user }: { user: User }) {
  return (
    <nav>
      <NavLinks />
      <UserMenu user={user} />  {/* Sidebar も user を使わない */}
    </nav>
  )
}
```

**Good (Composition で直接渡す):**

```tsx
// ✅ 必要なコンポーネントに直接データを渡す
function Page({ user }: { user: User }) {
  return (
    <Layout
      sidebar={
        <Sidebar>
          <UserMenu user={user} />  {/* ✅ 直接渡す */}
        </Sidebar>
      }
    >
      <Main />
    </Layout>
  )
}

function Layout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      {sidebar}
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <NavLinks />
      {children}
    </nav>
  )
}
```

**判断基準:**
- 中間コンポーネントが props を使わずただ渡しているだけなら Composition を検討
- 3階層以上の prop drilling は Composition またはContext で解決する
- グローバルな状態（テーマ、認証）は Context Provider を使う
- ページ固有のデータは Composition で必要な場所に直接配置する
