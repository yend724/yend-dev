## 通常フローの失敗は `try/catch` より `Result` 型で表現する

業務ロジックやアプリケーションロジックで想定内の失敗を扱うときは、例外送出より `Result` 型を優先する。失敗が型に現れるため、呼び出し側で処理漏れを減らせる。`try/catch` は例外境界やフレームワーク要件がある場所に限定する。

**Bad (想定内エラーを例外で制御):**

```ts
export const parsePrice = (input: string): number => {
  const value = Number(input)

  if (Number.isNaN(value)) {
    throw new Error("Invalid price")
  }

  return value
}

try {
  const price = parsePrice(form.price)
  await savePrice(price)
} catch {
  setMessage("価格が不正です")
}
```

**Good (`Result` 型で失敗を返す):**

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }

type ParsePriceError = "invalid-price"

export const parsePrice = (input: string): Result<number, ParsePriceError> => {
  const value = Number(input)

  if (Number.isNaN(value)) {
    return { ok: false, error: "invalid-price" }
  }

  return { ok: true, value }
}

const parsedPrice = parsePrice(form.price)

if (!parsedPrice.ok) {
  setMessage("価格が不正です")
  return
}

await savePrice(parsedPrice.value)
```

**`try/catch` を使ってよいケース:**
- React の Error Boundary 連携など、例外として伝播させる必要がある場合
- JSON parse、fetch client、SDK 呼び出しなど、外部 API が例外を投げうる境界をラップする場合
- プロセス起動時やジョブ実行時など、最上位で失敗を捕捉してログ化・終了制御する場合

**原則:**
- 想定内の失敗は戻り値で表現する
- 想定外の障害や外部境界の例外だけを `try/catch` で扱う
- `catch` したら握りつぶさず、`Result` へ変換するか、文脈を足して再送出する
