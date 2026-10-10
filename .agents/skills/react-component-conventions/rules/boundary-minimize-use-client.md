## "use client" はコンポーネントツリーの末端に置く

`"use client"` ディレクティブを付けたコンポーネントとその全ての子コンポーネントが Client Bundle に含まれる。ツリーの上位に置くほどバンドルが肥大化する。

**Bad (ページ全体を Client Component にしている):**

```tsx
"use client"

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)

  return (
    <div>
      <Header />           {/* インタラクション無し */}
      <ProductDetails />   {/* インタラクション無し */}
      <QuantitySelector    {/* これだけがインタラクティブ */}
        value={quantity}
        onChange={setQuantity}
      />
      <Reviews />          {/* インタラクション無し */}
    </div>
  )
}
```

**Good (インタラクティブ部分のみを Client Component に分離):**

```tsx
// ProductPage.tsx (Server Component)
export default function ProductPage() {
  return (
    <div>
      <Header />
      <ProductDetails />
      <QuantitySelector />  {/* この中だけ "use client" */}
      <Reviews />
    </div>
  )
}

// components/QuantitySelector.tsx
"use client"

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1)
  return (
    <div>
      <button onClick={() => setQuantity(q => q - 1)}>-</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity(q => q + 1)}>+</button>
    </div>
  )
}
```

**判断基準:**
- そのコンポーネントに `useState`, `useEffect`, `useRef`, イベントハンドラがあるか？
- それらを含むのは全体か、一部か？
- 一部なら、その部分だけを子コンポーネントとして切り出せないか？
