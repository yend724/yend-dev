## ページ全体を1つの Suspense で囲まない

ページ全体を1つの Suspense boundary で囲むと、最も遅いデータ取得が完了するまで全体がローディング状態になる。ユーザーはすぐに表示できるコンテンツすら見ることができず、体感速度が著しく低下する。

**Bad (ページ全体を単一 Suspense で囲む):**

```tsx
// ProductPage.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {/* ❌ 全体が最遅のレビュー取得(3s)まで見えない */}
      <ProductDetail id={params.id} />
    </Suspense>
  )
}

async function ProductDetail({ id }: { id: string }) {
  const product = await fetchProduct(id)           // 200ms
  const reviews = await fetchReviews(id)           // 3000ms
  const recommendations = await fetchRecommendations(id)  // 1500ms

  return (
    <div>
      <ProductInfo product={product} />
      <ReviewSection reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  )
}
```

**Good (セクションごとに Suspense を分割):**

```tsx
// ProductPage.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<ProductInfoSkeleton />}>
        <ProductInfo id={params.id} />           {/* 200ms で表示 */}
      </Suspense>
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations id={params.id} />       {/* 1500ms で表示 */}
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewSection id={params.id} />         {/* 3000ms で表示 */}
      </Suspense>
    </div>
  )
}

async function ProductInfo({ id }: { id: string }) {
  const product = await fetchProduct(id)
  return <div>{/* 商品情報 */}</div>
}

async function ReviewSection({ id }: { id: string }) {
  const reviews = await fetchReviews(id)
  return <div>{/* レビュー一覧 */}</div>
}
```

**判断基準:**
- ページに複数の独立したデータソースがある → 分割する
- ヘッダーやナビゲーションなど即座に表示すべき部分がある → Suspense の外に置く
- 初期表示に重要なコンテンツ（Above the fold）は最小限の Suspense で囲む
- 遅いデータ（レビュー、レコメンド等）は個別の Suspense で隔離する
