## データ変換はパイプライン的に読めるようにする

複数のステップからなるデータ変換は、上から下へ（または左から右へ）データが流れるパイプライン形式で書く。中間変数に意味のある名前を付けるか、メソッドチェーンで表現する。

**Bad (ネストした関数呼び出し):**

```ts
// ❌ 内側から外側に読む必要がある（読みにくい）
const result = formatForDisplay(
  sortByPriority(
    filterCompleted(
      enrichWithUserData(
        tasks,
        users
      )
    )
  )
)

// ❌ 一時変数なしの複雑な1行
const displayItems = items.filter(i => i.active && i.stock > 0).map(i => ({ ...i, price: i.price * (1 + taxRate), label: `${i.name} (${i.category})` })).sort((a, b) => b.price - a.price).slice(0, 10)
```

**Good (パイプライン的に読める構造):**

```ts
// ✅ メソッドチェーンで上から下に流れる
const displayItems = items
  .filter(item => item.active && item.stock > 0)
  .map(item => ({
    ...item,
    price: applyTax(item.price, taxRate),
    label: formatItemLabel(item),
  }))
  .toSorted((a, b) => b.price - a.price)
  .slice(0, 10)

// ✅ 中間変数に意味のある名前を付ける（複雑な変換の場合）
function buildDashboardData(
  rawEvents: ReadonlyArray<RawEvent>,
  users: ReadonlyArray<User>
): DashboardData {
  const validEvents = rawEvents.filter(isValidEvent)
  const enrichedEvents = validEvents.map(event => enrichWithUser(event, users))
  const groupedByDate = groupBy(enrichedEvents, event => event.date)
  const dailyStats = Object.entries(groupedByDate).map(([date, events]) => ({
    date,
    count: events.length,
    uniqueUsers: new Set(events.map(e => e.userId)).size,
  }))
  return { dailyStats: dailyStats.toSorted((a, b) => a.date.localeCompare(b.date)) }
}

// ✅ pipe ヘルパーを使う方法（ライブラリ不要の簡易版）
function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), value)
}

const processedTasks = pipe(
  tasks,
  tasks => tasks.filter(isNotCompleted),
  tasks => tasks.map(enrichWithUserData(users)),
  tasks => tasks.toSorted(byPriority),
  tasks => tasks.slice(0, 20)
)
```

**原則:**
- データは上から下へ流れるように書く（人間の読む方向と一致させる）
- 各ステップが何をしているか、関数名やメソッド名から読み取れるようにする
- 1行が長くなる場合は改行してメソッドチェーンを縦に並べる
- 3ステップ以上の変換は中間変数に名前を付けることを検討する
- `Array.prototype` メソッド（filter, map, reduce, flatMap）はそのままパイプラインになる
- TC39 pipe operator (`|>`) は Stage 2 であり未確定。現時点では上記の `pipe` ヘルパーや Remeda/Effect の `pipe()` で代用する
