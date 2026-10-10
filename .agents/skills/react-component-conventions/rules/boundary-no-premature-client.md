## クライアント機能を使わないのに "use client" を付けない

Client Component にする正当な理由が無いコンポーネントに `"use client"` を付けない。「なんとなく」や「エラーが出たから」で付けると、Server Component の利点を失う。

**`"use client"` が必要な正当な理由:**
- `useState`, `useReducer` を使う
- `useEffect`, `useLayoutEffect` を使う
- `onClick`, `onChange` 等のイベントハンドラを使う
- ブラウザ専用API（`window`, `document`, `localStorage`）を使う
- クライアント専用の外部ライブラリを使う（例: `framer-motion`）

**Bad (理由なく "use client" を付けている):**

```tsx
"use client"

// useState も useEffect もイベントハンドラも無い
export function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Joined: {formatDate(user.createdAt)}</p>
    </div>
  )
}
```

**Good (Server Component のまま):**

```tsx
// "use client" 不要 — 表示のみ
export function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Joined: {formatDate(user.createdAt)}</p>
    </div>
  )
}
```

**よくある間違い:**
- 「props を受け取るから Client Component にしないと」→ Server Component も props を受け取れる
- 「子コンポーネントが Client だから親も Client にしないと」→ 不要。Server Component の子に Client Component を置ける
- 「TypeScript の型エラーが出たから」→ 型の問題は型で解決する。`"use client"` はエラー回避の手段ではない
