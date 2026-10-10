## 障害の影響範囲を限定するために ErrorBoundary を適切に配置する

ErrorBoundary をページ全体にしか置いていないと、1つのコンポーネントのエラーでページ全体がエラー画面になる。独立したセクションごとに ErrorBoundary を配置することで、障害の影響を局所化し、残りのUIは正常に動作し続ける。

**Bad (ページ全体に1つの ErrorBoundary):**

```tsx
// ❌ レコメンドのエラーでページ全体がクラッシュ
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ProductInfo id={params.id} />
      <ReviewSection id={params.id} />
      <Recommendations id={params.id} />   {/* ここのエラーが全体に波及 */}
    </ErrorBoundary>
  )
}
```

**Good (セクションごとに ErrorBoundary を配置):**

```tsx
// react-error-boundary またはフレームワーク提供の ErrorBoundary を使用
import { ErrorBoundary } from "react-error-boundary"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* 重要なコンテンツ：エラー時はページレベルで処理 */}
      <ErrorBoundary fallback={<ProductErrorFallback />}>
        <Suspense fallback={<ProductInfoSkeleton />}>
          <ProductInfo id={params.id} />
        </Suspense>
      </ErrorBoundary>

      {/* 補助的なコンテンツ：エラー時は非表示でも可 */}
      <ErrorBoundary fallback={<ReviewsUnavailable />}>
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewSection id={params.id} />
        </Suspense>
      </ErrorBoundary>

      {/* 非重要コンテンツ：エラー時は代替UIを表示 */}
      <ErrorBoundary fallback={<FallbackRecommendations />}>
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations id={params.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function ReviewsUnavailable() {
  return (
    <div className="p-4 text-gray-500">
      レビューを読み込めませんでした。後ほどお試しください。
    </div>
  )
}
```

**判断基準:**
- 重要度の異なるセクションには個別の ErrorBoundary を配置する
- サードパーティ連携（レコメンド、広告等）は必ず独自の ErrorBoundary で囲む
- ErrorBoundary と Suspense を組み合わせてローディングとエラーの両方を処理する
- fallback にはリトライボタンや代替コンテンツを含め、ユーザーが次の行動を取れるようにする
