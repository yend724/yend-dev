## 副作用の依存関係を引数で明示する

副作用を含む処理を書く場合でも、その依存（APIクライアント、ストレージ、ロガーなど）は暗黙にimportするのではなく、引数やパラメータとして明示的に渡す。これによりテスト時のモック差し替えが容易になる。

**Bad (暗黙のimport依存):**

```ts
import { apiClient } from "@/lib/api"
import { logger } from "@/lib/logger"
import { cache } from "@/lib/cache"

// ❌ 3つの外部依存が暗黙的に結合
async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const cached = cache.get(`user:${userId}`)
  if (cached) {
    logger.info("Cache hit", { userId })
    return cached as UserProfile
  }

  const profile = await apiClient.get<UserProfile>(`/users/${userId}`)
  cache.set(`user:${userId}`, profile)
  logger.info("Fetched from API", { userId })
  return profile
}
```

**Good (依存を引数で明示):**

```ts
type ProfileDeps = {
  readonly getFromCache: (key: string) => unknown | null
  readonly setCache: (key: string, value: unknown) => void
  readonly fetchUser: (userId: string) => Promise<UserProfile>
  readonly log: (message: string, meta?: Record<string, unknown>) => void
}

// ✅ 依存が全て引数で明示されている
async function fetchUserProfile(
  userId: string,
  deps: ProfileDeps
): Promise<UserProfile> {
  const cached = deps.getFromCache(`user:${userId}`)
  if (cached) {
    deps.log("Cache hit", { userId })
    return cached as UserProfile
  }

  const profile = await deps.fetchUser(userId)
  deps.setCache(`user:${userId}`, profile)
  deps.log("Fetched from API", { userId })
  return profile
}

// 実際の使用箇所で依存を注入
const profile = await fetchUserProfile(userId, {
  getFromCache: (key) => cache.get(key),
  setCache: (key, value) => cache.set(key, value),
  fetchUser: (id) => apiClient.get(`/users/${id}`),
  log: (msg, meta) => logger.info(msg, meta),
})

// テスト時はモックを注入
const profile = await fetchUserProfile("user-1", {
  getFromCache: () => null,
  setCache: vi.fn(),
  fetchUser: async () => mockProfile,
  log: vi.fn(),
})
```

**判断基準:**
- ファイルトップレベルで副作用を持つモジュールを import している場合は依存注入を検討する
- テストで `vi.mock()` / `jest.mock()` が必要になるなら、設計を見直すサイン
- 全てに適用する必要はない：頻繁にテストする関数、再利用する関数を優先する
- 部分適用パターン（`createService(deps)` が関数群を返す）も有効な手段
