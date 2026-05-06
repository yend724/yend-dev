## 型の import は `import type` を使う

値として使わない import は `import type` を使って、型依存と実行時依存を分離する。可読性が上がり、ビルド時の最適化意図も明確になる。

**Bad (型と値の区別が曖昧):**

```ts
import { User, fetchUser } from "@/models/user"

export const loadUser = async (id: string): Promise<User> => {
  return fetchUser(id)
}
```

**Good (`import type` を使用):**

```ts
import type { User } from "@/models/user"
import { fetchUser } from "@/models/user"

export const loadUser = async (id: string): Promise<User> => {
  return fetchUser(id)
}
```

**補足:**
- `type` と値が同じモジュールにある場合でも分ける
- lint / formatter で自動修正できるなら機械的に統一する
