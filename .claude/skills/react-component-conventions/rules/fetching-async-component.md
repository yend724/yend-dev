## Server Component は async/await で直接データ取得する

Server Component は async function として定義でき、コンポーネント本体で直接 await できる。fetch ライブラリやカスタム hooks のラッパーは不要。

**Bad (不要な抽象化層を挟んでいる):**

```tsx
// hooks/useProduct.ts - Server Component では不要
"use client"
export function useProduct(id: string) {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(setProduct)
  }, [id])
  return product
}

// components/ProductPage.tsx
"use client"
export function ProductPage({ id }) {
  const product = useProduct(id)
  if (!product) return <Loading />
  return <div>{product.name}</div>
}
```

**Good (Server Component で直接取得):**

```tsx
// components/ProductPage.tsx (Server Component)
export async function ProductPage({ id }: { id: string }) {
  const product = await db.product.findUnique({ where: { id } })

  return <div>{product.name}</div>
}
```

**Good (外部APIからの取得):**

```tsx
export async function WeatherWidget({ city }: { city: string }) {
  const weather = await fetch(
    `https://api.weather.com/v1/${city}`
  ).then(r => r.json())

  return (
    <div>
      <span>{weather.temperature}°C</span>
      <span>{weather.condition}</span>
    </div>
  )
}
```

**注意点:**
- async Server Component を Suspense で囲むと、データ取得中に fallback が表示される
- Client Component は async にできない（`use()` hook を使う場合は別）
- エラーハンドリングは ErrorBoundary か try/catch で行う
