## テストは AAA パターンで構造化する

すべてのテストは Arrange（準備）→ Act（実行）→ Assert（確認）の3フェーズで構成する。この構造を統一することで、テストの可読性と保守性が向上する。

**Bad (フェーズが混在):**

```ts
test("カートに商品を追加する", () => {
  const cart = createCart()
  cart.add({ id: "a", price: 1000 })
  expect(cart.items).toHaveLength(1)  // NG: Act と Assert が混在
  cart.add({ id: "b", price: 500 })
  expect(cart.total).toBe(1500)       // NG: 2回目の Act + Assert
})
```

**Good (AAA パターン):**

```ts
test("カートに商品を追加すると合計金額が計算される", () => {
  // Arrange: テストの前提条件を準備する
  const items = [
    { id: "a", price: 1000 },
    { id: "b", price: 500 },
  ]

  // Act: テスト対象の振る舞いを1つだけ実行する
  const result = calculateTotal(items)

  // Assert: 結果を検証する
  expect(result).toBe(1500)
})
```

**Good (準備が複雑な場合):**

```ts
describe("注文処理", () => {
  test("在庫がある商品を注文できる", async () => {
    // Arrange
    const repository = createMockRepository({
      product: { id: "a", price: 1000, stock: 10 },
    })
    const order = { productId: "a", quantity: 2 }

    // Act
    const result = await processOrder(repository, order)

    // Assert
    expect(result.totalPrice).toBe(2000)
    expect(result.status).toBe("confirmed")
  })
})
```

**原則:**
- Act は1行（1つの振る舞い）にする。2行以上になる場合、複数の振る舞いをテストしている可能性がある
- Arrange が長くなる場合はヘルパー関数やファクトリに切り出す
- Assert は複数行でもよいが、すべて同じ振る舞いの結果を検証していること
- AAA の各フェーズは空行で区切る
- 各テストは独立して実行可能にする。`beforeAll` で可変状態を共有しない。テスト間の実行順序に依存しない
- async なテストでは Act / Assert の `await` を忘れない。`await` の欠落はテストが常に成功する偽陽性の原因になる
