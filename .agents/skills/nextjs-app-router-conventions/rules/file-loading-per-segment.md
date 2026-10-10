## 各ルートセグメントに適切な loading.tsx を配置する

`loading.tsx` は自動的にそのルートセグメントを Suspense でラップする。適切に配置することで、データ取得中も即座にローディングUIを表示し、準備できた部分から順に表示できる。

**Bad (ルートのみに loading.tsx を配置):**

```
app/
├── loading.tsx          ← ここだけ
├── dashboard/
│   ├── page.tsx
│   ├── settings/
│   │   └── page.tsx    ← ローディング表示なし
│   └── analytics/
│       └── page.tsx    ← ローディング表示なし
```

**Good (各セグメントに適切な loading.tsx):**

```
app/
├── loading.tsx                ← ルートレベル
├── dashboard/
│   ├── loading.tsx            ← ダッシュボード用スケルトン
│   ├── page.tsx
│   ├── settings/
│   │   ├── loading.tsx        ← 設定ページ用スケルトン
│   │   └── page.tsx
│   └── analytics/
│       ├── loading.tsx        ← 分析ページ用スケルトン
│       └── page.tsx
```

**loading.tsx の実装:**

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  // ✅ ページの構造を反映したスケルトン
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="h-32 animate-pulse bg-gray-200 rounded" />
      <div className="h-32 animate-pulse bg-gray-200 rounded" />
      <div className="h-32 animate-pulse bg-gray-200 rounded" />
      <div className="col-span-3 h-64 animate-pulse bg-gray-200 rounded" />
    </div>
  )
}
```

**配置の判断基準:**
- そのセグメントの page.tsx にデータ取得がある → loading.tsx を作る
- 子ルートへのナビゲーションがある → loading.tsx を作る
- 静的なページ（データ取得なし）→ loading.tsx は不要
- layout の共有部分はすでに表示されているので、loading.tsx は page 固有の部分のスケルトンを表示する
