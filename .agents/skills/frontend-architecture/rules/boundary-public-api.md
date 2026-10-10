## モジュール単位で public API を export する

各 feature は `index.ts` で外部に公開する API を定義する。他の feature からは `index.ts` 経由でインポートし、内部ファイルを直接参照しない。feature 内のファイル同士は自由に参照してよい。

feature 間の依存は public API 経由であれば許容するが、**循環依存は禁止**する。

**Bad:**

```tsx
// ❌ 他の feature の内部ファイルを直接インポート
import { useAuth } from "@/features/auth/hooks/use-auth"
import { LoginForm } from "@/features/auth/components/login-form"
```

**Good:**

```tsx
// ✅ public API（index.ts）経由でインポート
import { useAuth, LoginForm } from "@/features/auth"
```

### index.ts の書き方

feature が外部に公開するものだけを re-export する。内部実装の詳細は公開しない。

```ts
// features/auth/index.ts
export { LoginForm } from "./components/login-form"
export { SignupForm } from "./components/signup-form"
export { useAuth } from "./hooks/use-auth"
export type { User, AuthState } from "./types"
```

### 循環依存の回避

feature A と feature B が互いに依存する場合、共通部分を shared に切り出す。

```
// ❌ 循環依存
features/auth → features/user → features/auth

// ✅ 共通部分を切り出す
features/auth → shared/lib/user-utils
features/user → shared/lib/user-utils
```
