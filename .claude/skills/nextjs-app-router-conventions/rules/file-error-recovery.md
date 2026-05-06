## error.tsx でリカバリ可能なUIを提供する

`error.tsx` は React Error Boundary として機能し、そのルートセグメント内で発生したエラーをキャッチする。ユーザーがアプリを離れることなく復帰できるよう、リトライボタンや代替UIを提供する。

**Bad (error.tsx がない、またはリカバリ手段がない):**

```tsx
// app/dashboard/error.tsx
"use client"

export default function Error() {
  // ❌ リカバリ手段がない — ユーザーは何もできない
  return <p>エラーが発生しました</p>
}
```

**Good (リカバリ可能なUI):**

```tsx
// app/dashboard/error.tsx
"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーログサービスに送信
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-bold">問題が発生しました</h2>
      <p className="text-gray-600">
        ダッシュボードの読み込み中にエラーが発生しました。
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        もう一度試す
      </button>
    </div>
  )
}
```

**原則:**
- `error.tsx` は必ず `"use client"` を宣言する（Error Boundary はクライアントコンポーネント）
- `reset()` を呼ぶことで、エラーが発生したセグメントの再レンダリングを試みる
- `error.digest` はサーバーエラーのハッシュ値 — ログ追跡に使える
- `app/global-error.tsx` で Root Layout のエラーもキャッチできる
