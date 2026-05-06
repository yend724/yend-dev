## 重い状態更新には useTransition を使う

画面の更新をスキップできない場合でも、同期的に行う必要がある更新（テキスト入力など）と、ノンブロッキングで良い更新（リストのフィルタリング、タブ切替など）を分離できる。useTransition は状態更新をノンブロッキングなトランジションとしてマークし、ユーザ操作のブロックを防ぐ。

**Bad (重い更新がUIをブロック):**

```tsx
"use client"

const TabContainer = () => {
  const [tab, setTab] = useState("home")

  // ❌ タブ切替が重いコンポーネントの描画を待つ間、UIがフリーズ
  const handleTabChange = (nextTab: string) => {
    setTab(nextTab)
  }

  return (
    <div>
      <TabBar current={tab} onChange={handleTabChange} />
      <TabContent tab={tab} />
    </div>
  )
}
```

**Good (useTransition でノンブロッキングに):**

```tsx
"use client"

const TabContainer = () => {
  const [tab, setTab] = useState("home")
  const [isPending, startTransition] = useTransition()

  const handleTabChange = (nextTab: string) => {
    // ✅ タブ切替をトランジションとしてマーク
    // ユーザはフリーズを感じず、別のタブをすぐクリックできる
    startTransition(() => {
      setTab(nextTab)
    })
  }

  return (
    <div>
      <TabBar current={tab} onChange={handleTabChange} />
      {/* ✅ isPending で遷移中を視覚的に表現 */}
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <TabContent tab={tab} />
      </div>
    </div>
  )
}
```

```tsx
"use client"

// ✅ Suspense と組み合わせて既存コンテンツを維持
const SearchResults = () => {
  const [query, setQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ 入力欄は即座に更新（同期的）
    setQuery(e.target.value)

    // ✅ 検索結果の更新はノンブロッキング
    startTransition(() => {
      setSearchQuery(e.target.value)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <Suspense fallback={<Skeleton />}>
          <Results query={searchQuery} />
        </Suspense>
      </div>
    </div>
  )
}
```

**useTransition の特性:**
- `startTransition` に渡した関数は即座に実行されるが、その中でスケジュールされた状態更新が低優先度になる
- トランジション中にユーザが別の操作をすると、React はトランジションを中断して新しい操作を優先する
- `isPending` でトランジション中の視覚的フィードバック（opacity を下げる等）を提供できる
- Suspense と組み合わせると、既に表示されているコンテンツを Suspense fallback で隠さずに済む

**制約:**
- テキスト入力の制御（controlled input の value 更新）には使えない — 入力は常に同期的に応答する必要がある
- `async` 関数内の `await` の後で状態を更新する場合は、その更新を別の `startTransition` で囲む必要がある

**useDeferredValue との使い分け:**
- 状態の更新タイミングを自分で制御できる → `useTransition`
- 親から受け取った props を遅延させたい → `useDeferredValue`
