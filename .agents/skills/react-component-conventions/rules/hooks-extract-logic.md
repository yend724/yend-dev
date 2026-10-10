## 計算ロジックは hook の外の pure function として抽出する

custom hook 内にビジネスロジックや変換処理を直接書くと、React のライフサイクルに縛られてテストが困難になる。計算ロジックは pure function として hook の外に抽出する。

**Bad (hook 内にロジックが混在):**

```tsx
function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const total = useMemo(() => {
    // ❌ 複雑な計算ロジックが hook 内に
    return items.reduce((sum, item) => {
      const price = item.onSale
        ? item.price * (1 - item.discountRate)
        : item.price
      const tax = price * 0.1
      return sum + (price + tax) * item.quantity
    }, 0)
  }, [items])

  const addItem = (product: Product, quantity: number) => {
    setItems(prev => {
      // ❌ 追加ロジックも hook に直書き
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  return { items, total, addItem }
}
```

**Good (ロジックを pure function として分離):**

```tsx
// lib/cart.ts — pure functions、hook に依存しない
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = applyDiscount(item)
    const tax = calculateTax(price)
    return sum + (price + tax) * item.quantity
  }, 0)
}

export function applyDiscount(item: CartItem): number {
  return item.onSale ? item.price * (1 - item.discountRate) : item.price
}

export function calculateTax(price: number): number {
  return price * 0.1
}

export function addItemToCart(items: CartItem[], product: Product, quantity: number): CartItem[] {
  const existing = items.find(i => i.id === product.id)
  if (existing) {
    return items.map(i =>
      i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
    )
  }
  return [...items, { ...product, quantity }]
}

// hooks/useCart.ts — 状態管理のみ
function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const total = useMemo(() => calculateTotal(items), [items])

  const addItem = useCallback((product: Product, quantity: number) => {
    setItems(prev => addItemToCart(prev, product, quantity))
  }, [])

  return { items, total, addItem }
}
```

**メリット:**
- `calculateTotal`, `addItemToCart` は React 無しで単体テスト可能
- 同じロジックを Server Component やAPI側でも再利用できる
- hook はstate管理の「接着剤」に徹する
