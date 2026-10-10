## Server → Client に渡す props はシリアライズ可能にする

Server Component から Client Component に渡す props は RSC プロトコルでシリアライズされる。関数、クラスインスタンス、Date オブジェクト等は渡せない。

**シリアライズ可能な値:**
- string, number, boolean, null, undefined
- Array, plain Object（中身もシリアライズ可能であること）
- Server Actions（`"use server"` で定義された関数）
- ReactElement（JSX）

**シリアライズ不可能な値:**
- 通常の関数・アロー関数
- クラスインスタンス
- Date, Map, Set, RegExp
- Symbol
- DOM ノード

**Bad (関数やDateを直接渡している):**

```tsx
// Server Component
export default function Page() {
  const handleClick = () => console.log("clicked")
  const createdAt = new Date()

  return (
    <ClientComponent
      onClick={handleClick}    // ❌ 関数は渡せない
      date={createdAt}         // ❌ Date は渡せない
    />
  )
}
```

**Good (シリアライズ可能な形に変換):**

```tsx
// Server Component
export default function Page() {
  return (
    <ClientComponent
      dateStr={new Date().toISOString()}  // ✅ 文字列に変換
    />
  )
}

// Client Component
"use client"

export function ClientComponent({ dateStr }: { dateStr: string }) {
  const handleClick = () => console.log("clicked")  // ✅ Client 側で定義
  const date = new Date(dateStr)                    // ✅ Client 側で復元

  return <button onClick={handleClick}>{date.toLocaleDateString()}</button>
}
```

**Server Action を使うパターン:**

```tsx
// Server Component
import { submitForm } from "./actions"

export default function Page() {
  return <ClientForm action={submitForm} />  // ✅ Server Action は渡せる
}
```

**判断基準:**
- その props は JSON.stringify できるか？
- 関数を渡したい場合、Server Action にできないか？
- 複雑なオブジェクトは plain object に変換してから渡す
