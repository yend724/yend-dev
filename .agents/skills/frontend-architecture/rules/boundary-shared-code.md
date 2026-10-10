## 2つ以上の feature で使うコードは shared に置く

1つの feature にしか使われないコードはその feature 内に置く。2つ以上の feature で共有するコードは `shared/` に移動する。

**Bad:**

```tsx
// ❌ auth feature 内のユーティリティを dashboard feature から直接インポート
import { formatUserName } from "@/features/auth/utils/format-user-name"
```

**Good:**

```tsx
// ✅ 共通ユーティリティとして shared/lib/ に配置
import { formatUserName } from "@/shared/lib/format-user-name"
```

### shared 内のディレクトリ構成

| ディレクトリ | 内容 |
|-------------|------|
| `shared/components/` | feature に属さない共通 UI コンポーネント |
| `shared/hooks/` | feature に属さない共通 hooks |
| `shared/lib/` | ユーティリティ関数、API クライアントなど |
| `shared/types/` | 複数 feature で共有する型定義 |

### 判断基準

- 最初は feature 内に置き、2つ目の feature で必要になった時点で shared に移動する
- 「将来使うかもしれない」で先に共通化しない
