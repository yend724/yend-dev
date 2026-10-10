## Server Component はロジック抽出 + E2E でテストする

React Server Component（RSC）は async なデータ取得やサーバー専用 API を含むため、標準的な jsdom レンダリングでは信頼性のあるテストが難しい。ロジックを純粋関数として抽出して単体テストし、表示の検証は E2E に委ねる。

**Bad (Server Component を直接レンダリングしようとする):**

```tsx
import { render, screen } from "@testing-library/react"
import { ProductList } from "./product-list"

// NG: async Server Component は jsdom でレンダリングできない
test("商品一覧を表示する", () => {
  render(<ProductList />)
  expect(screen.getByText("商品A")).toBeInTheDocument()
})
```

**Good (ロジックを抽出して単体テスト):**

```ts
// product-list.ts — ロジックを純粋関数として抽出
export const filterAvailableProducts = (
  products: ReadonlyArray<Product>
): Product[] => {
  return products.filter(p => p.stock > 0)
}

export const sortByPrice = (
  products: ReadonlyArray<Product>
): Product[] => {
  return products.toSorted((a, b) => a.price - b.price)
}
```

```ts
// product-list.test.ts — 抽出したロジックをテスト
import { describe, expect, test } from "vitest"
import { filterAvailableProducts, sortByPrice } from "./product-list"

describe("filterAvailableProducts", () => {
  test("在庫がある商品のみ返す", () => {
    const products = [
      { id: "a", stock: 5, price: 1000 },
      { id: "b", stock: 0, price: 500 },
    ]
    expect(filterAvailableProducts(products)).toEqual([
      { id: "a", stock: 5, price: 1000 },
    ])
  })
})
```

```ts
// e2e/products.spec.ts — 表示の検証は E2E で
import { test, expect } from "@playwright/test"

test("商品一覧ページに在庫のある商品が表示される", async ({ page }) => {
  await page.goto("/products")
  await expect(page.getByText("商品A")).toBeVisible()
  await expect(page.getByText("在庫切れ商品")).not.toBeVisible()
})
```

**Server Component のテスト戦略:**

| テスト対象 | 手法 |
|-----------|------|
| データ変換・フィルタ・ソートのロジック | 純粋関数として抽出し Vitest で単体テスト |
| コンポーネントの表示結果 | Playwright E2E |
| Client Component 部分 | Vitest + Testing Library でコンポーネントテスト |

**原則:**
- Server Component 自体を単体テストしようとしない
- テスト可能にしたいロジックは純粋関数として切り出す（FP 規約とも整合する）
- 表示の統合的な検証は E2E に任せる
