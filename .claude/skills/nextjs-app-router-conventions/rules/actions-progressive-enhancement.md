## JavaScript 無効でもフォームが動作するようにする

Server Action を `<form action={...}>` に渡すと、JavaScript が無効でもフォーム送信が動作する。`useActionState` と組み合わせることで、JS有効時はスムーズなUX、無効時でも基本機能が動作する。

**Bad (JavaScript 必須の実装):**

```tsx
"use client"

export function ContactForm() {
  const handleSubmit = async () => {
    // ❌ onClick でしか動かない — JS無効で完全に動作しない
    const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) })
  }

  return (
    <div>
      <input onChange={(e) => setData(e.target.value)} />
      <button onClick={handleSubmit}>送信</button>
    </div>
  )
}
```

**Good (Progressive Enhancement):**

```tsx
// app/contact/actions.ts
"use server"

export async function submitContact(
  _prevState: { success: boolean; error?: string },
  formData: FormData
) {
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!email || !message) {
    return { success: false, error: "すべての項目を入力してください" }
  }

  await sendEmail({ to: "support@example.com", from: email, body: message })
  return { success: true }
}
```

```tsx
// app/contact/contact-form.tsx
"use client"

import { useActionState } from "react"
import { submitContact } from "./actions"

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, { success: false })

  return (
    <form action={action}>
      {state.success && <p className="text-green-600">送信しました</p>}
      {state.error && <p className="text-red-600">{state.error}</p>}

      <label htmlFor="email">メールアドレス</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="message">メッセージ</label>
      <textarea id="message" name="message" required />

      <button type="submit" disabled={pending}>
        {pending ? "送信中..." : "送信"}
      </button>
    </form>
  )
}
```

**原則:**
- `<form action={serverAction}>` を使えば JS 無効でもフォーム送信が可能
- `name` 属性でフォームデータを識別する（`useState` に頼らない）
- `useActionState` で JS 有効時のペンディング状態やエラー表示を強化する
- HTML標準の `required`, `type="email"` などのバリデーションも併用する
