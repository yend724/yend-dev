## ビジネスロジックはpure functionとして書く

ビジネスロジック（価格計算、バリデーション、データ変換、フィルタリングなど）は必ずpure functionとして実装する。外部状態への依存や変更を行わず、引数のみから結果を導出する。

**Bad (外部状態に依存するロジック):**

```ts
// ❌ グローバル変数に依存
let discountRate = 0.1

function calculatePrice(item: Product): number {
  // ❌ 外部のdiscountRateに依存 → テスト時に状態管理が必要
  const price = item.price * (1 - discountRate)
  // ❌ Date.now()に依存 → 実行タイミングで結果が変わる
  if (Date.now() > CAMPAIGN_END) {
    return item.price
  }
  return price
}

function validateUser(input: UserInput): boolean {
  // ❌ DB に依存
  const existing = db.users.findByEmail(input.email)
  return input.email !== "" && !existing
}
```

**Good (pure functionとして実装):**

```ts
// ✅ 全ての依存が引数で渡される
function calculatePrice(
  item: Product,
  discountRate: number,
  currentTime: number,
  campaignEnd: number
): number {
  if (currentTime > campaignEnd) {
    return item.price
  }
  return item.price * (1 - discountRate)
}

// ✅ 外部状態に一切依存しない
function validateUserInput(values: {
  email: string
  termsAccepted: boolean
}): ValidationResult {
  const errors: string[] = []
  if (!values.email.includes("@")) {
    errors.push("メールアドレスが無効です")
  }
  if (!values.termsAccepted) {
    errors.push("利用規約への同意が必要です")
  }
  return { isValid: errors.length === 0, errors }
}

// IO層（コントローラー）で副作用的な値を注入
async function createUserHandler(input: UserInput): Promise<Result<User>> {
  const validation = validateUserInput(input) // pure functionを呼ぶだけ
  if (!validation.isValid) {
    return { ok: false, errors: validation.errors }
  }
  // IO操作はここ（境界層）で行う
  const existing = await db.users.findByEmail(input.email)
  if (existing) {
    return { ok: false, errors: ["このメールアドレスは既に使用されています"] }
  }
  const user = await db.users.create(input)
  return { ok: true, data: user }
}
```

**原則:**
- pure function = 同じ引数 → 常に同じ戻り値、副作用なし
- `Date.now()`, `Math.random()` は引数として外から注入する
- IO操作（DB読み書き、ファイル操作、ネットワーク通信）はコントローラー/ハンドラー層に集約する
- バリデーション・計算・変換・フィルタリングは全て pure にできる
