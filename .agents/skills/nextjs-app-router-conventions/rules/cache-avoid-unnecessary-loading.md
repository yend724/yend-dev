## ナビゲーション時に不要なローディングを出さない

Next.js のキャッシュを適切に活用し、ページ遷移のたびにリスト等が毎回ローディング状態になることを避ける。ただしキャッシュの最適化は UX に支障がある箇所から対応すればよく、全 fetch に厳密なルールを適用する必要はない。

### キャッシュ設計の指針

**ナビゲーション体験を優先する:**

```tsx
// ✅ 一覧ページ: revalidate でキャッシュし、遷移時のローディングを防ぐ
async function ProductList() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 60, tags: ["products"] },
  }).then(r => r.json())

  return <ul>{/* ... */}</ul>
}

// ✅ データ更新時はオンデマンドで無効化
"use server"
import { revalidateTag } from "next/cache"

export async function createProduct(formData: FormData) {
  await db.product.create({ data: { /* ... */ } })
  revalidateTag("products")  // 次回アクセス時に最新データを取得
}
```

**個人データの漏洩には注意する:**

```tsx
// ✅ ユーザー固有データはキャッシュしない
const profile = await fetch(`${API_URL}/me/profile`, {
  cache: "no-store",
}).then(r => r.json())
```

### 判断の目安

| 状況 | 方針 |
|------|------|
| 全ユーザー共通のデータ | `revalidate` + `tags` でキャッシュ |
| ユーザー固有のデータ | `cache: "no-store"` または動的レンダリング |
| 更新頻度が低いデータ | 長めの `revalidate` |
| ユーザー操作で更新されるデータ | `revalidateTag` でオンデマンド無効化 |
| UX に支障がない箇所 | デフォルトのまま（過度な最適化は不要） |

### 注意点

- Next.js 15 以降、`fetch` のデフォルトは `no-store`（キャッシュなし）。キャッシュしたい場合は明示的に `revalidate` を指定する
- `cache` と `next.revalidate` は同時に指定しない
- ORM / 直接 DB 接続の場合は Route Segment Config (`export const revalidate = N`) で制御する
