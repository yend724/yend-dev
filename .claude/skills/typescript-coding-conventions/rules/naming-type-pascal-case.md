## 型・interface・class・enum は `PascalCase` にする

型シンボルは値と区別しやすいように `PascalCase` で統一する。`Props`、`Result`、`Input` のような接尾辞も必要なときだけ意味を持って使う。

**Bad:**

```ts
type user_profile = {
  id: string
}

interface userRepository {
  findById(id: string): Promise<User>
}
```

**Good:**

```ts
type UserProfile = {
  id: string
}

interface UserRepository {
  findById(id: string): Promise<User>
}
```

**原則:**
- 型名に `I` プレフィックスは付けない
- `Data`, `Info`, `Manager` のような曖昧な語を安易に使わない
