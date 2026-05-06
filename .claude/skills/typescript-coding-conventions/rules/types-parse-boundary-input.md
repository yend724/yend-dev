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
