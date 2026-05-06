## モジュール内は相対パス、モジュール外は絶対パスでインポートする

同一モジュール（feature）内のファイル参照には相対パスを使い、モジュール外への参照にはエイリアス付き絶対パスを使う。これによりモジュールの境界が視覚的に明確になる。

**Bad (モジュール内で絶対パス):**

```ts
// features/auth/components/login-form.tsx
// ❌ 同一 feature 内なのに絶対パス → 境界が曖昧になる
import { useAuth } from "@/features/auth/hooks/use-auth"
import type { AuthState } from "@/features/auth/types"
```

**Bad (モジュール外で相対パス):**

```ts
// features/auth/components/login-form.tsx
// ❌ 別モジュールへの参照に相対パス → 依存方向が読みにくい
import { Button } from "../../../shared/components/ui/button"
import { useCart } from "../../cart"
```

**Good:**

```ts
// features/auth/components/login-form.tsx

// ✅ モジュール外 → 絶対パス
import { Button } from "@/shared/components/ui/button"
import { apiClient } from "@/shared/lib/api-client"
import { useCart } from "@/features/cart"

// ✅ モジュール内 → 相対パス
import { useAuth } from "../hooks/use-auth"
import type { AuthState } from "../types"
```

**判断基準:**
- インポート先が同じ feature 内 → 相対パス（`./`, `../`）
- インポート先が別の feature / shared / app → 絶対パス（`@/`）
- 相対パスが見えたら「同じモジュール内」、絶対パスが見えたら「モジュール境界を越えている」と即座に判断できる
