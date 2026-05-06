## インタラクティブ要素のみを Client Component として切り出す

ユーザーインタラクション（クリック、入力、ホバー等）を必要とする最小単位のみを Client Component にする。表示のみの部分は Server Component に残す。

**Bad (表示ロジックごとクライアント化):**

```tsx
"use client"

export function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <article>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{formatPrice(product.price)}</span>
      <StarRating rating={product.rating} />
      <button onClick={() => setIsWishlisted(!isWishlisted)}>
        {isWishlisted ? "♥" : "♡"}
      </button>
    </article>
  )
}
```

**Good (インタラクティブ要素のみ分離):**

```tsx
// components/ProductCard.tsx (Server Component)
export function ProductCard({ product }) {
  return (
    <article>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{formatPrice(product.price)}</span>
      <StarRating rating={product.rating} />
      <WishlistButton productId={product.id} />
    </article>
  )
}

// components/WishlistButton.tsx
"use client"

export function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <button onClick={() => setIsWishlisted(!isWishlisted)}>
      {isWishlisted ? "♥" : "♡"}
    </button>
  )
}
```

**判断基準:**
- インタラクティブな部分は全体の何%か？
- 表示のみの部分にデータ取得や重い計算があるか？（あればサーバーに残す価値が高い）
- 分離のコストに見合うか？（ボタン1つのために分けるのは適切、1行の表示のためだけに分けるのは過剰）
