## 依存方向は app → features → shared の単方向にする

依存は常に上位層から下位層への単方向にする。下位層が上位層に依存してはならない。

```
app/（ルーティング層）
  ↓ インポートできる
features/（機能層）
  ↓ インポートできる
shared/（共通層）
```

**許可される依存:**

```tsx
// ✅ app/ → features/
// src/app/dashboard/page.tsx
import { StatsCard } from "@/features/dashboard"

// ✅ app/ → shared/
// src/app/layout.tsx
import { Button } from "@/shared/components/ui/button"

// ✅ features/ → shared/
// src/features/auth/components/login-form.tsx
import { Button } from "@/shared/components/ui/button"
import { apiClient } from "@/shared/lib/api-client"

// ✅ features/ → 別の features/（public API 経由）
// src/features/dashboard/components/user-stats.tsx
import { useAuth } from "@/features/auth"
```

**禁止される依存:**

```tsx
// ❌ shared/ → features/
// src/shared/lib/api-client.ts
import { useAuth } from "@/features/auth"

// ❌ shared/ → app/
// src/shared/components/ui/header.tsx
import { metadata } from "@/app/layout"
```
