## 状態の網羅性チェックにDiscriminated Unionを使う

複数の状態を持つデータ（非同期処理結果、フォームステップ、UIモードなど）は、共通のdiscriminantプロパティを持つunion型として定義する。switch文と `satisfies never` で網羅性を保証する。

**Bad (booleanフラグの組み合わせ):**

```ts
// ❌ 不正な状態の組み合わせが型上は許可される
type RequestState = {
  isLoading: boolean
  isError: boolean
  data: User[] | null
  error: Error | null
}

// isLoading: true かつ isError: true かつ data: [...] は何を意味する？
function UserList({ state }: { state: RequestState }) {
  // ❌ フラグの優先順位を毎回考える必要がある
  if (state.isLoading) return <Spinner />
  if (state.isError) return <Error message={state.error?.message ?? ""} />
  if (!state.data) return <Empty />
  return <List items={state.data} />
}
```

**Good (Discriminated Unionで不正な状態を型で排除):**

```ts
// ✅ 各状態が持つデータを正確に型で表現
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T }

// ✅ 各分岐で型が絞り込まれる
function UserList({ state }: { state: RequestState<User[]> }) {
  switch (state.status) {
    case "idle":
      return null
    case "loading":
      return <Spinner />
    case "error":
      // state.error は Error 型に絞り込まれている
      return <ErrorDisplay message={state.error.message} />
    case "success":
      // state.data は User[] 型に絞り込まれている
      return <List items={state.data} />
  }
  // ✅ 網羅性チェック：新しいstatusを追加したらコンパイルエラーになる
  state satisfies never
}

// ✅ フォームのステップ管理
type FormStep =
  | { step: "input"; values: Partial<FormValues> }
  | { step: "confirm"; values: FormValues }
  | { step: "submitting"; values: FormValues }
  | { step: "complete"; result: SubmitResult }

function getStepTitle(formStep: FormStep): string {
  switch (formStep.step) {
    case "input": return "入力"
    case "confirm": return "確認"
    case "submitting": return "送信中"
    case "complete": return "完了"
  }
  formStep satisfies never
}

// ✅ アクションの型安全なdispatch
type TodoAction =
  | { type: "add"; payload: { title: string } }
  | { type: "toggle"; payload: { id: string } }
  | { type: "delete"; payload: { id: string } }
  | { type: "reorder"; payload: { fromIndex: number; toIndex: number } }

function todoReducer(state: ReadonlyArray<Todo>, action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, { id: crypto.randomUUID(), title: action.payload.title, done: false }]
    case "toggle":
      return state.map(t => t.id === action.payload.id ? { ...t, done: !t.done } : t)
    case "delete":
      return state.filter(t => t.id !== action.payload.id)
    case "reorder": {
      const { fromIndex, toIndex } = action.payload
      const item = state[fromIndex]
      const without = state.toSpliced(fromIndex, 1)
      return without.toSpliced(toIndex, 0, item)
    }
  }
  action satisfies never
}
```

**判断基準:**
- 2つ以上の boolean フラグで状態を表現している → Discriminated Union にリファクタ
- `data | null` と `error | null` が同時に存在する型 → union で排他的にする
- switch文の最後に `satisfies never` を置いて網羅性を保証する
- discriminant プロパティ名は `status`, `type`, `kind`, `step` などが一般的
- reducer パターンと組み合わせると特に強力（アクションの網羅性もチェック可能）
