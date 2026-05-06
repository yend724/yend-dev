## 型定義はReadonly/ReadonlyArrayをデフォルトにする

関数の引数、戻り値の型定義には `Readonly<T>` および `ReadonlyArray<T>` をデフォルトで使用する。変更が必要な箇所でのみ mutable な型を明示的に使う。

**Bad (mutableな型定義):**

```ts
// ❌ 引数が変更可能 → 呼び出し元のデータを壊すリスク
type ProcessOptions = {
  items: Todo[]
  onComplete: (items: Todo[]) => void
}

// ❌ 関数の引数が変更可能 → 呼び出し元の配列を壊すリスク
function sortTodos(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => a.priority - b.priority) // 元の配列を破壊！
}

// ❌ 型がミューテーションを許可している
type AppConfig = {
  users: User[]
  settings: {
    theme: string
    locale: string
  }
}
```

**Good (Readonlyをデフォルトに):**

```ts
// ✅ 引数型はReadonlyで受け取る
type ProcessOptions = Readonly<{
  items: ReadonlyArray<Todo>
  onComplete: (items: ReadonlyArray<Todo>) => void
}>

// ✅ 引数がReadonlyなのでsortは使えず、toSortedを使う必要がある
function sortTodos(todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  return todos.toSorted((a, b) => a.priority - b.priority)
}

// ✅ 型レベルで不変性を保証
type AppConfig = Readonly<{
  users: ReadonlyArray<User>
  settings: Readonly<{
    theme: string
    locale: string
  }>
}>

// ✅ ユーティリティ型で深いReadonlyを定義
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T

type ImmutableConfig = DeepReadonly<Config>
```

**判断基準:**
- 関数が引数を変更しない場合（ほとんどの場合）→ `ReadonlyArray` / `Readonly` を使う
- 関数内部で戻り値を構築するためのローカル変数は mutable でも良い（スコープが限定的なため）
- ライブラリの型定義が mutable を要求する場合は `as` で対応（例: `items as Todo[]`）
- 新規の型定義は `Readonly` から始めて、必要に応じて外す方針にする
- `readonly` プロパティ修飾子と `Readonly<T>` ユーティリティ型は同等
