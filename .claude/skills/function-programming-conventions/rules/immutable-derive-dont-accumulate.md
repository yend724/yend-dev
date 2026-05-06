## 導出可能な値を別途保持せず計算で求める

既に存在するデータから計算できる値を別のフィールドやキャッシュとして保持しない。代わりに必要な時点で計算（derive）する。Single Source of Truth を維持し、データの同期ズレを防ぐ。

**Bad (導出可能な値を別途保持して同期管理):**

```ts
type ProductStore = {
  products: Product[]
  searchQuery: string
  // ❌ filteredProducts は products + searchQuery から導出可能
  filteredProducts: Product[]
  // ❌ totalCount も filteredProducts から導出可能
  totalCount: number
  // ❌ hasResults も filteredProducts から導出可能
  hasResults: boolean
}

function updateSearch(store: ProductStore, query: string): ProductStore {
  // ❌ 全ての冗長フィールドを手動で同期する必要がある
  const filtered = store.products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )
  return {
    ...store,
    searchQuery: query,
    filteredProducts: filtered,
    totalCount: filtered.length,
    hasResults: filtered.length > 0,
  }
}

// ❌ products を更新した時も filteredProducts を再計算し忘れるリスク
function addProduct(store: ProductStore, product: Product): ProductStore {
  return {
    ...store,
    products: [...store.products, product],
    // filteredProducts の更新を忘れている → 同期ズレバグ！
  }
}
```

**Good (データは最小限、残りは導出関数で計算):**

```ts
// ✅ 保持するデータは最小限のソースデータのみ
type ProductStore = {
  readonly products: ReadonlyArray<Product>
  readonly searchQuery: string
}

// ✅ フィルタリングロジックをpure functionとして分離
function filterProducts(products: ReadonlyArray<Product>, query: string): Product[] {
  if (!query) return [...products]
  const lowerQuery = query.toLowerCase()
  return products.filter(p => p.name.toLowerCase().includes(lowerQuery))
}

// ✅ 導出値は関数呼び出しで取得（保持しない）
function getProductSummary(store: ProductStore) {
  const filtered = filterProducts(store.products, store.searchQuery)
  const totalCount = filtered.length
  const hasResults = totalCount > 0
  return { filtered, totalCount, hasResults }
}

// ✅ ソースデータの更新だけで整合性が自動的に保たれる
function addProduct(store: ProductStore, product: Product): ProductStore {
  return {
    ...store,
    products: [...store.products, product],
    // filteredProducts は getProductSummary() を呼べば常に最新
  }
}

function updateSearch(store: ProductStore, query: string): ProductStore {
  return { ...store, searchQuery: query }
}

// ✅ パフォーマンスが問題になる場合はメモ化ユーティリティを使う
function memoize<TArgs extends readonly unknown[], TResult>(
  fn: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
  let lastArgs: TArgs | undefined
  let lastResult: TResult
  return (...args: TArgs): TResult => {
    if (lastArgs && args.every((arg, i) => arg === lastArgs![i])) {
      return lastResult
    }
    lastArgs = args
    lastResult = fn(...args)
    return lastResult
  }
}

const getFilteredProducts = memoize(filterProducts)
```

**判断基準:**
- 「この値は他のデータから計算できるか？」→ Yes なら保持しない
- あるデータを更新した時に別のフィールドも手動で更新している → 導出関数にリファクタ
- 計算コストが高い場合のみメモ化ユーティリティを使う、低い場合は毎回計算で十分
- 真に独立したデータ（ユーザー入力、外部からの取得データ）のみを保持する
- 「最小限のソースデータ + 導出関数」パターンはデータ整合性を構造的に保証する
