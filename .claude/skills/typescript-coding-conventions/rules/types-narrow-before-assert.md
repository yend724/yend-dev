## `as const` を除き、`as` アサーションは可能な限り避ける

型アサーションは「型検査器を黙らせる」手段であり、正しさを保証しない。`as const` のようにリテラル型を固定する用途は別だが、それ以外の `as` は可能な限り避ける。`typeof`、`in`、`Array.isArray`、ユーザー定義 type guard を使って、実行時に確認可能な根拠で型を絞り込む。

**Bad (根拠のない `as`):**

```ts
const userId = (payload as { user: { id: string } }).user.id

const items = response as Item[]
return items[0].name
```

**Good (絞り込みを先に行う):**

```ts
const hasUserId = (value: unknown): value is { user: { id: string } } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "user" in value &&
    typeof value.user === "object" &&
    value.user !== null &&
    "id" in value.user &&
    typeof value.user.id === "string"
  )
}

if (!hasUserId(payload)) {
  throw new Error("Invalid payload")
}

const userId = payload.user.id
```

**例外:**
- DOM API や外部 SDK が返す値について、呼び出し元で事前条件が保証されている場合

その場合でも、アサーションは境界付近の狭い範囲に留める。
*** Add File: skills/typescript-coding-conventions/rules/types-parse-boundary-input.md
## 外部入力や不確実なデータは parser で parse してから扱う

API response、`req.body`、query parameter、`localStorage`、`process.env`、DB から復元した JSON などの外部入力は、そのままアプリケーション内部へ流さない。`zod` や `valibot` のような parser ライブラリで検証・変換してから扱う。

TypeScript の型注釈だけでは実行時の入力は検証されない。境界で parse して、内部では信頼できる型として扱う。

**Bad (型注釈だけで信じる):**

```ts
type CreateUserBody = {
  name: string
  age: number
}

const body = req.body as CreateUserBody
await createUser(body)
```

**Good (boundary で parse する):**

```ts
import * as v from "valibot"

const CreateUserBodySchema = v.object({
  name: v.string(),
  age: v.number(),
})

const body = v.parse(CreateUserBodySchema, req.body)
await createUser(body)
```

**Good (parse failure を `Result` に変換する):**

```ts
import * as v from "valibot"

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }

const CreateUserBodySchema = v.object({
  name: v.string(),
  age: v.number(),
})

const parseCreateUserBody = (input: unknown): Result<v.InferOutput<typeof CreateUserBodySchema>, "invalid-body"> => {
  const result = v.safeParse(CreateUserBodySchema, input)

  if (!result.success) {
    return { ok: false, error: "invalid-body" }
  }

  return { ok: true, value: result.output }
}
```

**対象になる境界:**
- HTTP request / response
- URL parameter / search parameter
- `process.env`
- `localStorage` / `sessionStorage`
- 外部 SDK / webhook payload
- JSON file / DB から復元した動的データ

**原則:**
- 境界の外は `unknown` とみなす
- 境界で parse してから内部型へ変換する
- parse 失敗は握りつぶさず、`Result` か明示的なエラーに変換する
