## `SCREAMING_SNAKE_CASE` は真に固定された定数だけに使う

`SCREAMING_SNAKE_CASE` は設定値、HTTP ステータス、正規表現、タイムアウト値など、モジュールスコープで固定される値に限定する。通常の `const` 変数は `camelCase` にする。

**Bad:**

```ts
const USER_NAME = profile.name
const TOTAL_PRICE = items.reduce((sum, item) => sum + item.price, 0)
```

**Good:**

```ts
const MAX_RETRY_COUNT = 3
const REQUEST_TIMEOUT_MS = 5000

const userName = profile.name
const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
```

**原則:**
- 「再代入されない」だけでは大文字化の理由にならない
- 実行時に導出される値は `const` でも `camelCase` にする
