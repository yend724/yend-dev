## 変数宣言は const をデフォルトにする

変数は `const` で宣言する。`let` は再代入が本当に必要な場合のみ使用する。`var` は禁止。再代入の代わりに、新しい `const` 変数への束縛や関数型の手法（`map`, `filter`, `reduce` 等）で表現する。

**Bad (不要な let / var):**

```ts
// ❌ var は禁止
var result = compute()

// ❌ 再代入で値を組み立てている
let total = 0
for (const item of items) {
  total += item.price
}

// ❌ 条件分岐で let に再代入
let label
if (status === "active") {
  label = "有効"
} else {
  label = "無効"
}
```

**Good (const + 関数型の手法):**

```ts
// ✅ reduce で集約
const total = items.reduce((sum, item) => sum + item.price, 0)

// ✅ 三項演算子や即時関数で const に束縛
const label = status === "active" ? "有効" : "無効"

// ✅ 複雑な条件は関数に抽出して const に束縛
const label = resolveLabel(status)
```

**let が許容されるケース:**
- ループカウンタやリトライカウンタなど、再代入が本質的に必要な場合
- `try/catch` で結果を受け取る場合（ただし関数抽出で const にできないか先に検討する）

```ts
// ✅ 再代入が本質的に必要
let retries = 3
while (retries > 0) {
  try {
    return await fetchData()
  } catch {
    retries--
  }
}
```
