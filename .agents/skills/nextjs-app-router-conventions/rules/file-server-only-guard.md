## サーバー専用モジュールには import "server-only" を付ける

DB アクセス、シークレット参照、サーバー専用ライブラリを含むモジュールには `import "server-only"` を追加する。Client Component から誤ってインポートされた場合にビルドエラーで検出できる。

**Bad (ガードなし — Client Component から誤って import できてしまう):**

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client"

// ❌ "use client" のファイルから import してもビルドが通る
export const db = new PrismaClient()
```

```ts
// lib/auth.ts
// ❌ シークレットが Client Bundle に含まれるリスク
const SECRET = process.env.AUTH_SECRET!

export const verifyToken = (token: string) => {
  // ...
}
```

**Good (server-only でガード):**

```ts
// lib/db.ts
import "server-only"
import { PrismaClient } from "@prisma/client"

// ✅ Client Component から import するとビルドエラー
export const db = new PrismaClient()
```

```ts
// lib/auth.ts
import "server-only"

const SECRET = process.env.AUTH_SECRET!

// ✅ サーバー専用であることが保証される
export const verifyToken = (token: string) => {
  // ...
}
```

**付けるべきファイル:**
- DB クライアントや ORM のインスタンス
- `process.env` のシークレット（`NEXT_PUBLIC_` でない環境変数）を参照するモジュール
- サーバー専用の外部ライブラリを使うモジュール
- Server Actions のユーティリティ

**付けなくてよいファイル:**
- Server Component 自体（`.tsx` のページやコンポーネント）は `"use client"` が無ければサーバーで動作するため不要
- Server / Client 両方で使える純粋なユーティリティ関数
