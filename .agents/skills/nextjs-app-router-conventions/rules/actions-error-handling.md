## Server Action のエラーはクライアントに安全に返す

Server Action で throw されたエラーはクライアントに伝播するが、内部実装の詳細やスタックトレースをそのまま返すとセキュリティリスクになる。構造化されたレスポンスで安全にエラーを返す。

**Bad (エラーをそのまま throw):**

```tsx
"use server"

export async function createOrder(formData: FormData) {
  try {
    await processPayment(formData)
  } catch (error) {
    // ❌ 内部エラーメッセージがクライアントに露出する
    throw error
  }
}
```

**Good (構造化されたレスポンスで返す):**

```tsx
"use server"

type ActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createOrder(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth()
  if (!session) {
    return { success: false, error: "ログインが必要です" }
  }

  const parsed = orderSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await processPayment(parsed.data)
    return { success: true }
  } catch (error) {
    // サーバーログには詳細を残す
    console.error("Payment failed:", error)
    // クライアントにはユーザー向けメッセージのみ
    return { success: false, error: "決済処理に失敗しました。再度お試しください。" }
  }
}
```

```tsx
// クライアント側での利用
"use client"

import { useActionState } from "react"
import { createOrder } from "./actions"

export function OrderForm() {
  const [state, action, pending] = useActionState(createOrder, { success: false })

  return (
    <form action={action}>
      {state.error && <p className="text-red-600">{state.error}</p>}
      {/* フォームフィールド */}
      <button type="submit" disabled={pending}>注文する</button>
    </form>
  )
}
```

**原則:**
- 内部のエラーメッセージ、スタックトレース、DB情報をクライアントに返さない
- `useActionState` を使って構造化されたレスポンスを扱う
- バリデーションエラーはフィールド単位で返す
- 予期しないエラーはログに記録し、ユーザーには汎用メッセージを返す
