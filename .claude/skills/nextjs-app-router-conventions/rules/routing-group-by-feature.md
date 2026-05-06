## Route Groups で機能単位にグルーピングする

Route Groups `(groupName)` を使うと、URLに影響を与えずにルートを論理的にグルーピングし、異なるレイアウトを適用できる。

**Bad (フラットな構造で全ページが同じレイアウト):**

```
app/
├── layout.tsx          ← 全ページに同じレイアウト
├── page.tsx
├── login/page.tsx      ← ログインページにもサイドバーが出る
├── signup/page.tsx
├── dashboard/page.tsx
├── settings/page.tsx
└── admin/page.tsx
```

**Good (機能単位でグルーピング):**

```
app/
├── (auth)/
│   ├── layout.tsx      ← 認証ページ用レイアウト（シンプル、ロゴのみ）
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (app)/
│   ├── layout.tsx      ← アプリ用レイアウト（サイドバー、ナビ）
│   ├── dashboard/page.tsx
│   └── settings/page.tsx
├── (admin)/
│   ├── layout.tsx      ← 管理画面用レイアウト
│   └── admin/page.tsx
└── layout.tsx           ← Root Layout（html, body）
```

**URL への影響:**
- `(auth)` はURLに含まれない → `/login`, `/signup`
- `(app)` はURLに含まれない → `/dashboard`, `/settings`

**使い所:**
- 異なるレイアウトを適用したい（認証ページ vs アプリ内ページ）
- 論理的なグルーピングで可読性を上げたい
- 特定グループにのみ Proxy を適用したい

**注意:**
- 同一階層の Route Groups 内に同じパス名のページを作らない（衝突する）
- Root Layout は必ず1つ必要（Route Groups の外に置く）
