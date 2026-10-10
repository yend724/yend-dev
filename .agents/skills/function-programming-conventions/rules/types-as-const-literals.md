## リテラル型にはas constを活用する

定数オブジェクト、設定値、選択肢の定義には `as const` を使ってリテラル型として推論させる。これにより TypeScript の型システムを最大限活用し、タイポや無効な値の混入をコンパイル時に防ぐ。

**Bad (widened types):**

```ts
// ❌ string[] に推論される → 任意の文字列が入る
const ROLES = ["admin", "editor", "viewer"]
// type: string[]

// ❌ { label: string; value: string } に推論される
const STATUS_OPTIONS = [
  { label: "下書き", value: "draft" },
  { label: "公開中", value: "published" },
  { label: "アーカイブ", value: "archived" },
]

// ❌ 手動で型を二重管理
type Role = "admin" | "editor" | "viewer"
const ROLES: Role[] = ["admin", "editor", "viewer"]

// ❌ オブジェクトのキーが string に広がる
const API_ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
  comments: "/api/comments",
}
// type: { users: string; posts: string; comments: string }
```

**Good (as constでリテラル型を活用):**

```ts
// ✅ readonly ["admin", "editor", "viewer"] に推論される
const ROLES = ["admin", "editor", "viewer"] as const
type Role = (typeof ROLES)[number] // "admin" | "editor" | "viewer"

// ✅ 各valueがリテラル型として推論される
const STATUS_OPTIONS = [
  { label: "下書き", value: "draft" },
  { label: "公開中", value: "published" },
  { label: "アーカイブ", value: "archived" },
] as const
type Status = (typeof STATUS_OPTIONS)[number]["value"] // "draft" | "published" | "archived"

// ✅ オブジェクトのvalueもリテラル型に
const API_ENDPOINTS = {
  users: "/api/users",
  posts: "/api/posts",
  comments: "/api/comments",
} as const
type Endpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]
// "/api/users" | "/api/posts" | "/api/comments"

// ✅ satisfies と組み合わせて型安全性と推論を両立
const THEME_COLORS = {
  primary: "#3b82f6",
  secondary: "#64748b",
  danger: "#ef4444",
} as const satisfies Record<string, `#${string}`>
// 型チェック（16進形式を強制）しつつリテラル型を維持

// ✅ イベント名の型安全なマッピング
const ANALYTICS_EVENTS = {
  pageView: "page_view",
  buttonClick: "button_click",
  formSubmit: "form_submit",
} as const

function track(event: (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]) {
  // "page_view" | "button_click" | "form_submit" のみ受け付ける
}
```

**判断基準:**
- 定数の配列・オブジェクトを定義するとき → `as const` を付ける
- 定数から型を導出できるとき → 型を手動で書かず `typeof` + インデックスアクセスで導出する
- `satisfies` と併用すると、型チェックしつつリテラル推論を維持できる
- `as const` は `Readonly` + リテラル型推論のショートカット
- enum の代わりに `as const` + union type を使うのがモダンなパターン
