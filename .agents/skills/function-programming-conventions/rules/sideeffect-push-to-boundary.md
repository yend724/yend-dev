## 副作用をIO境界に押し出す

副作用（API呼び出し、ファイルシステム操作、DB書き込み、ログ送信など）はアプリケーションの境界層（APIハンドラ、CLIエントリーポイント、コントローラー層）に集約し、ビジネスロジック層からは排除する。これにより、ロジックの大部分がpure functionとなり、テスト・推論が容易になる。

**Bad (ロジック内に副作用が散在):**

```ts
function processOrder(order: Order): OrderResult {
  // ❌ ロジックの途中でAPIコール
  const tax = fetchTaxRate(order.region)
  const total = order.items.reduce((sum, item) => sum + item.price, 0)
  const finalTotal = total * (1 + tax)

  // ❌ ロジックの途中でDB書き込み
  db.orders.insert({ ...order, total: finalTotal })

  // ❌ ロジックの途中でログ送信
  logger.info("order_processed", { total: finalTotal })

  return { ...order, total: finalTotal, status: "processed" }
}
```

**Good (副作用を境界に押し出し、ロジックをpureに):**

```ts
// Pure: 計算ロジックのみ
function calculateOrderTotal(order: Order, taxRate: number): number {
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0)
  return subtotal * (1 + taxRate)
}

function buildOrderResult(order: Order, total: number): OrderResult {
  return { ...order, total, status: "processed" }
}

// Boundary (APIハンドラ): 副作用はここに集約
async function handleProcessOrder(req: Request): Promise<Response> {
  const order = await req.json() as Order
  const taxRate = await fetchTaxRate(order.region)
  const total = calculateOrderTotal(order, taxRate)
  const result = buildOrderResult(order, total)

  await db.orders.insert(result)
  logger.info("order_processed", { total })

  return Response.json(result)
}

// Boundary (CLIエントリーポイント): 副作用はここに集約
async function main(): Promise<void> {
  const order = JSON.parse(await readFile("order.json", "utf-8")) as Order
  const taxRate = await fetchTaxRate(order.region)
  const total = calculateOrderTotal(order, taxRate)
  const result = buildOrderResult(order, total)

  await writeFile("result.json", JSON.stringify(result))
  console.log(`Order processed: total=${total}`)
}
```

**判断基準:**
- 関数内で `fetch`, `fs`, `db`, `console`, `Date.now()`, `Math.random()` を使っていたら副作用
- APIハンドラ、CLIエントリーポイント、コントローラー層が「境界」にあたる
- pure function は同じ入力に対して常に同じ出力を返す
- 「この関数はネットワーク・DB・ファイルシステム無しでテストできるか？」が判断の目安
