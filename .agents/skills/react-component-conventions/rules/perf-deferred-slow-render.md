## 遅いコンポーネントには useDeferredValue で入力のレスポンスを維持する

入力に連動して重いコンポーネントが再レンダーされる場合、useDeferredValue で値の更新を遅延させることで入力のレスポンシブ性を維持できる。React は古い値で先に画面を更新し、バックグラウンドで新しい値での再レンダーを試みる。

**Bad (入力のたびに重いリストが同期的に再レンダー):**

```tsx
"use client"

const SearchPage = ({ items }: { items: Item[] }) => {
  const [query, setQuery] = useState("")

  // ❌ query が変わるたびに SlowList が同期的に再レンダー
  // 入力が遅延・カクつく
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <SlowList query={query} items={items} />
    </div>
  )
}
```

**Good (useDeferredValue + memo で入力を優先):**

```tsx
"use client"

const SearchPage = ({ items }: { items: Item[] }) => {
  const [query, setQuery] = useState("")
  // ✅ リストに渡す値を遅延させる
  const deferredQuery = useDeferredValue(query)

  return (
    <div>
      {/* ✅ 入力は即座に反映 */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {/* ✅ 古い値であることを視覚的に示す */}
      <div style={{ opacity: query !== deferredQuery ? 0.7 : 1 }}>
        <SlowList query={deferredQuery} items={items} />
      </div>
    </div>
  )
}

// ✅ memo でラップすることで、deferredQuery が変わらない間は再レンダーをスキップ
const SlowList = memo(({ query, items }: { query: string; items: Item[] }) => {
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )
  return (
    <ul>
      {filtered.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
})
```

```tsx
"use client"

// ✅ Suspense と組み合わせて、新しいデータ読み込み中に古い結果を表示
const UserSearch = () => {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Suspense fallback={<Skeleton />}>
        {/* ✅ Suspense と併用すると、新データ読み込み中に */}
        {/* fallback ではなく古い結果が表示され続ける */}
        <div style={{ opacity: isStale ? 0.7 : 1 }}>
          <UserResults query={deferredQuery} />
        </div>
      </Suspense>
    </div>
  )
}
```

**動作の仕組み:**
1. 入力が変わると、React はまず古い `deferredValue` で画面を即座に更新（入力だけ反映）
2. バックグラウンドで新しい値での再レンダーを試行
3. さらに入力があると、バックグラウンドレンダーは中断されてやり直される

**memo が必須:**
- `useDeferredValue` 単体では最適化にならない
- 遅延値を受け取るコンポーネントを `memo` でラップすることで、値が変わらない間の再レンダーがスキップされる

**デバウンスとの違い:**
- デバウンスは固定の待機時間がある。useDeferredValue はデバイスの性能に適応する
- 高速なデバイスでは遅延がほぼ発生せず、低速なデバイスでは自動的に遅延が大きくなる
- useDeferredValue による再レンダーは中断可能だが、デバウンスは一度始まると止められない

**useTransition との使い分け:**
- 状態の更新を自分で制御できる場合 → `useTransition`（startTransition で更新をラップ）
- 親から props として受け取った値を遅延させたい場合 → `useDeferredValue`
- 両者は同じ仕組み（優先度の低いレンダー）を使っており、状況に応じて使い分ける
