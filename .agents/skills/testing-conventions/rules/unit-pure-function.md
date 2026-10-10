## 振る舞いの単位でテストする

テストの「単位」は関数やクラスではなく、**振る舞いの単位**。1つのテストケースは「ある入力に対して、ビジネス上意味のある結果が返る」ことを検証する。内部でどの関数を経由しているかは関心事ではない。

**Bad (実装詳細に結合):**

```ts
import { vi } from "vitest"
import { calculateTotal } from "./cart"
import * as tax from "./tax"

test("calculateTotal", () => {
  // NG: 内部で呼ばれる関数を spy して検証
  // リファクタリングで内部構造が変わるとテストが壊れる
  const spy = vi.spyOn(tax, "calculateTax")
  calculateTotal(items)
  expect(spy).toHaveBeenCalledWith(1000)
})
```

**Good (観測可能な振る舞いのみ検証):**

```ts
import { describe, expect, test } from "vitest"
import { calculateTotal, applyDiscount, addItemToCart } from "./cart"

describe("calculateTotal", () => {
  test("商品の合計金額を計算する", () => {
    const items = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 },
    ]
    // OK: 入力と最終的な出力だけを検証
    expect(calculateTotal(items)).toBe(2500)
  })

  test("空配列は0を返す", () => {
    expect(calculateTotal([])).toBe(0)
  })
})

describe("applyDiscount", () => {
  test("割引率を適用する", () => {
    expect(applyDiscount(1000, 0.1)).toBe(900)
  })

  test("割引率0は元の価格を返す", () => {
    expect(applyDiscount(1000, 0)).toBe(1000)
  })
})

describe("addItemToCart", () => {
  test("新しいアイテムを追加する", () => {
    const cart = [{ id: "a", quantity: 1 }]
    const result = addItemToCart(cart, { id: "b", quantity: 2 })
    expect(result).toEqual([
      { id: "a", quantity: 1 },
      { id: "b", quantity: 2 },
    ])
  })

  test("既存アイテムは数量を加算する", () => {
    const cart = [{ id: "a", quantity: 1 }]
    const result = addItemToCart(cart, { id: "a", quantity: 3 })
    expect(result).toEqual([{ id: "a", quantity: 4 }])
  })

  test("元の配列を変更しない", () => {
    const cart = [{ id: "a", quantity: 1 }]
    addItemToCart(cart, { id: "b", quantity: 1 })
    expect(cart).toEqual([{ id: "a", quantity: 1 }])
  })
})
```

**原則:**
- テスト名はビジネス上の振る舞いを日本語で書く（「税込み合計を計算する」等）
- 検証するのは最終的な出力（戻り値、状態変化、外部への呼び出し）のみ
- 内部の関数呼び出し順序や回数は検証しない
- 境界値やエッジケース（空配列、0、負の値）を含める
- リファクタリングしてもテストが壊れないことが良いテストの指標
