## 1つの custom hook は1つの関心事のみを扱う

custom hook が複数の無関係な状態やロジックを持つと、テストが困難になり、部分的な再利用ができなくなる。1つの hook は1つの明確な責務のみを持つ。

**Bad (複数の関心事が混在):**

```tsx
function useProductPage(productId: string) {
  // 関心事1: データ取得
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // 関心事2: カート操作
  const [quantity, setQuantity] = useState(1)
  const [isInCart, setIsInCart] = useState(false)

  // 関心事3: UI状態
  const [activeTab, setActiveTab] = useState("details")
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => { /* fetch product... */ }, [productId])

  const addToCart = () => { /* ... */ }
  const nextImage = () => { /* ... */ }

  return { product, loading, quantity, setQuantity, isInCart, addToCart, activeTab, setActiveTab, imageIndex, nextImage }
}
```

**Good (関心事ごとに分離):**

```tsx
// データ取得（ただし Server Component で取得する方が望ましい）
function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { /* fetch */ }, [productId])

  return { product, loading }
}

// カート操作
function useCartItem(productId: string) {
  const [quantity, setQuantity] = useState(1)
  const [isInCart, setIsInCart] = useState(false)

  const addToCart = useCallback(() => { /* ... */ }, [productId, quantity])

  return { quantity, setQuantity, isInCart, addToCart }
}

// 画像ギャラリー
function useImageGallery(images: string[]) {
  const [index, setIndex] = useState(0)

  const next = () => setIndex(i => (i + 1) % images.length)
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)

  return { currentImage: images[index], next, prev, index }
}
```

**判断基準:**
- hook の返り値が6個以上 → 分割を検討
- hook 内の state が互いに無関係 → 分割すべき
- hook の名前が `useXxxPage` や `useXxxContainer` → 分割すべき（ページ全体の状態管理は hook の責務ではない）
- hook をテストする時に mock すべき外部依存が多すぎる → 分割すべき
