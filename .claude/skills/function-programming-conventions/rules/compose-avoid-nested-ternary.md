## ネストした三項演算子を避け、early returnやmatch的パターンを使う

条件分岐が2段以上ネストする場合、三項演算子ではなく early return、オブジェクトマップ、または明示的な分岐関数を使う。

**Bad (ネストした三項演算子):**

```ts
// ❌ ロジック内のネスト三項
const message = status === "loading"
  ? "読み込み中..."
  : status === "error"
    ? errorCode === 404
      ? "見つかりませんでした"
      : errorCode === 403
        ? "アクセス権がありません"
        : "エラーが発生しました"
    : data.length === 0
      ? "データがありません"
      : `${data.length}件のデータ`

// ❌ 関数内のネスト三項
function formatResponse(result: ProcessResult): string {
  return result.status === "success"
    ? result.warnings.length > 0
      ? `完了（警告あり: ${result.warnings.join(", ")}）`
      : "完了"
    : result.retryable
      ? `失敗（リトライ可能: ${result.error}）`
      : `失敗（${result.error}）`
}
```

**Good (明確な分岐パターン):**

```ts
// ✅ オブジェクトマップでステータスに応じたメッセージを返す
function getStatusMessage(status: Status, data: ReadonlyArray<unknown>): string {
  const messages: Record<Status, () => string> = {
    loading: () => "読み込み中...",
    error: () => "エラーが発生しました",
    success: () => data.length === 0 ? "データがありません" : `${data.length}件のデータ`,
  }
  return messages[status]()
}

// ✅ early return パターン
function getErrorMessage(errorCode: number): string {
  if (errorCode === 404) return "見つかりませんでした"
  if (errorCode === 403) return "アクセス権がありません"
  return "エラーが発生しました"
}

// ✅ early return で複雑な条件を整理
function formatResponse(result: ProcessResult): string {
  if (result.status === "success") {
    if (result.warnings.length > 0) {
      return `完了（警告あり: ${result.warnings.join(", ")}）`
    }
    return "完了"
  }
  if (result.retryable) {
    return `失敗（リトライ可能: ${result.error}）`
  }
  return `失敗（${result.error}）`
}

// ✅ Discriminated Unionとexhaustive checkの組み合わせ
type ProcessState =
  | { kind: "pending" }
  | { kind: "running"; progress: number }
  | { kind: "error"; error: AppError }
  | { kind: "completed"; result: ProcessOutput }

function describeState(state: ProcessState): string {
  switch (state.kind) {
    case "pending": return "処理待ち"
    case "running": return `処理中... ${state.progress}%`
    case "error": return `エラー: ${state.error.message}`
    case "completed": return `完了: ${state.result.summary}`
    default: return state satisfies never // TypeScript が網羅性をチェック
  }
}
```

**判断基準:**
- 三項演算子は1段（`condition ? a : b`）まで。ネストは禁止
- 条件が3つ以上あるなら switch/if-else/オブジェクトマップを使う
- `satisfies never` で網羅性チェックを活用する
- 単純な2択（truthy/falsy）のみ三項演算子を許容する
