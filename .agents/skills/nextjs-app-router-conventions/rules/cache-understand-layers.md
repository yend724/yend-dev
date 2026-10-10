## 4つのキャッシュレイヤーを理解して設計する

Next.js App Router には4つのキャッシュレイヤーがある。各レイヤーの役割と無効化方法を理解しないと、「変更したのに反映されない」「毎回再フェッチされてしまう」等の問題が起きる。

**4つのキャッシュレイヤー:**

| レイヤー | 場所 | キャッシュ対象 | 無効化方法 |
|---------|------|--------------|-----------|
| Request Memoization | サーバー | 同一レンダリング内の重複 fetch | 自動（レンダリング完了で破棄） |
| Data Cache | サーバー | fetch レスポンス | `revalidateTag`, `revalidatePath`, time-based |
| Full Route Cache | サーバー | レンダリング済みHTML/RSC Payload | `revalidatePath`, dynamic rendering |
| Router Cache | クライアント | 訪問済みルートの RSC Payload | `router.refresh()`, `revalidatePath`, 時間経過 |

**各レイヤーの制御:**

```tsx
// 1. Request Memoization — 自動、制御不要
// 同じ fetch を複数コンポーネントから呼んでも1回しか実行されない
async function ComponentA() {
  const data = await fetch("/api/data")  // 1回目: 実行
}
async function ComponentB() {
  const data = await fetch("/api/data")  // 2回目: メモ化された結果を返す
}

// 2. Data Cache — fetch オプションで制御
await fetch(url, { cache: "force-cache" })          // キャッシュ（opt-in、v15+ではデフォルトではない）
await fetch(url, { cache: "no-store" })             // キャッシュしない（v15+のデフォルト）
await fetch(url, { next: { revalidate: 3600 } })    // 1時間ごとに再検証
await fetch(url, { next: { tags: ["posts"] } })     // タグで無効化可能に

// 3. Full Route Cache — Route Segment Config で制御
export const dynamic = "force-dynamic"   // 毎リクエスト再レンダリング
export const revalidate = 3600           // 1時間ごとに再生成

// 4. Router Cache — クライアント側で制御
"use client"
import { useRouter } from "next/navigation"
const router = useRouter()
router.refresh()  // 現在のルートのキャッシュを無効化
```

**よくある問題と対処:**

| 問題 | 原因 | 対処 |
|------|------|------|
| データ更新が反映されない | Data Cache / Router Cache | `revalidateTag` + Server Action |
| ログイン後も前のユーザーのデータが見える | Router Cache | `router.refresh()` or `revalidatePath` |
| 毎回遅い（キャッシュが効かない） | `no-store` の過剰使用 | 適切な `revalidate` 値に変更 |
| 開発時と本番で挙動が違う | 開発時はキャッシュ無効 | 本番デプロイで確認 |

> **Note:** Next.js 15 以降、`fetch` のデフォルトキャッシュ動作が `no-store`（キャッシュなし）に変更された。キャッシュを有効にするには `cache: "force-cache"` または `next: { revalidate: N }` を明示的に指定する必要がある。
