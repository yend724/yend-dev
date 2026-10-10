## useMemo / useCallback を計測なしに使わない

useMemo と useCallback はパフォーマンス最適化のためだけに存在する。計測せずに「念のため」で付けるとコードの複雑さだけが増え、効果がない。まず計測し、本当にボトルネックになっている箇所にだけ適用する。

**Bad (計測なしに全関数・全計算をメモ化):**

```tsx
"use client"

const UserList = ({ users }: { users: User[] }) => {
  // ❌ 軽い計算に useMemo は不要
  const userCount = useMemo(() => users.length, [users])

  // ❌ memo されていない子に渡す useCallback は無意味
  const handleClick = useCallback((id: string) => {
    console.log(id)
  }, [])

  // ❌ 単純なフィルタリングにも useMemo
  const activeUsers = useMemo(
    () => users.filter(u => u.isActive),
    [users]
  )

  return (
    <div>
      <p>{userCount} users</p>
      {activeUsers.map(user => (
        <UserCard key={user.id} user={user} onClick={handleClick} />
      ))}
    </div>
  )
}
```

**Good (計測して必要な箇所だけメモ化):**

```tsx
"use client"

const UserList = ({ users }: { users: User[] }) => {
  // ✅ 軽い計算はそのまま書く
  const userCount = users.length
  const activeUsers = users.filter(u => u.isActive)

  const handleClick = (id: string) => {
    console.log(id)
  }

  return (
    <div>
      <p>{userCount} users</p>
      {activeUsers.map(user => (
        <UserCard key={user.id} user={user} onClick={handleClick} />
      ))}
    </div>
  )
}
```

```tsx
"use client"

// ✅ 重い計算（1ms以上）+ memo済みコンポーネントへの受け渡しがあるケース
const Dashboard = ({ transactions }: { transactions: Transaction[] }) => {
  // console.time で計測して 1ms 以上かかることを確認済み
  const summary = useMemo(
    () => computeExpensiveSummary(transactions),
    [transactions]
  )

  // MemoizedChart が memo でラップされているため useCallback が有効
  const handleDataPointClick = useCallback((point: DataPoint) => {
    selectDataPoint(point)
  }, [])

  return <MemoizedChart data={summary} onPointClick={handleDataPointClick} />
}
```

**useMemo / useCallback が本当に必要なケース:**
- `console.time` で計測して 1ms 以上かかる計算 → `useMemo`
- `memo` でラップされたコンポーネントに渡す関数 → `useCallback`
- `memo` でラップされたコンポーネントに渡すオブジェクト → `useMemo`
- `useEffect` の依存配列に含まれるオブジェクトや関数 → `useMemo` / `useCallback`

**メモ化より先にやるべきこと:**
- props/state から計算できる値を state に入れていないか → レンダー中に直接計算する
- 子コンポーネントを children として受け入れる設計にできないか → 不要な再レンダー自体を防げる
- state を必要なコンポーネントの近くに配置できないか → 影響範囲を縮小できる

**React Compiler について:**
- React Compiler が有効な環境では useMemo / useCallback が自動適用される
- Compiler 導入済みの場合、手動のメモ化は原則不要
- ただし Compiler はまだ段階的に導入されるため、プロジェクトの導入状況に応じて判断する
