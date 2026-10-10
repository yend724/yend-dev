## インポートはカテゴリ順に並べ、グループ間に空行を入れる

インポートは以下の順にグループ化し、グループ間に空行を入れる：

1. React / フレームワーク（`react`, `next/*` など）
2. 外部ライブラリ
3. プロジェクト内の絶対パス（エイリアス）インポート
4. 相対パスインポート

**Bad:**

```tsx
// ❌ グループ分けなし、順序がバラバラ
import { UserAvatar } from "./user-avatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/lib/api";
```

**Good:**

```tsx
// ✅
import { useState } from "react";
import { useRouter } from "next/navigation";

import { clsx } from "clsx";

import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/api";

import { UserAvatar } from "./user-avatar";
import { formatDate } from "./utils";
```
