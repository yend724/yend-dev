## export する関数は戻り値型を明示する

公開インターフェースの戻り値型は推論に任せず明示する。内部実装の変更が外部に見える契約へ波及しにくくなり、呼び出し側との契約も読み取りやすくなる。

**Bad (推論に依存した公開インターフェース):**

```ts
export const buildUser = (input: CreateUserInput) => {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    active: true,
  }
}
```

**Good (戻り値型を明示):**

```ts
type User = {
  id: string
  name: string
  active: boolean
}

export const buildUser = (input: CreateUserInput): User => {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    active: true,
  }
}
```

**補足:**
- ローカルな短い無名関数やコールバックは推論でよい
- `export` される関数、class method、公開 hook は明示を優先する
