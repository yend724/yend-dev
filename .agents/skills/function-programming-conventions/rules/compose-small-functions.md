## 関数は小さく、単一目的に保つ

1つの関数は1つのことだけを行う。複数の処理を含む関数は、それぞれ名前の付いた小さな関数に分解する。関数名が処理の説明になるため、コメントの代わりにもなる。

**Bad (1つの関数に複数の責務):**

```ts
function processUserData(rawUsers: RawUser[]): DisplayUser[] {
  // ❌ フィルタリング、変換、ソート、フォーマットが全て1つの関数に
  const result: DisplayUser[] = []

  for (const user of rawUsers) {
    if (!user.isActive) continue
    if (user.role === "bot") continue

    const fullName = `${user.lastName} ${user.firstName}`
    const displayAge = user.birthDate
      ? Math.floor((Date.now() - user.birthDate.getTime()) / 31557600000)
      : null
    const department = user.departmentId
      ? departments.find(d => d.id === user.departmentId)?.name ?? "不明"
      : "未所属"

    result.push({
      id: user.id,
      fullName,
      age: displayAge,
      department,
      joinedAt: user.createdAt.toLocaleDateString("ja-JP"),
    })
  }

  result.sort((a, b) => a.fullName.localeCompare(b.fullName, "ja"))
  return result
}
```

**Good (小さな単一目的の関数に分解):**

```ts
const isDisplayableUser = (user: RawUser): boolean =>
  user.isActive && user.role !== "bot"

const calculateAge = (birthDate: Date, now: number): number =>
  Math.floor((now - birthDate.getTime()) / 31557600000)

const resolveDepartmentName = (
  departmentId: string | null,
  departments: ReadonlyArray<Department>
): string => {
  if (!departmentId) return "未所属"
  return departments.find(d => d.id === departmentId)?.name ?? "不明"
}

const toDisplayUser = (user: RawUser, departments: ReadonlyArray<Department>): DisplayUser => ({
  id: user.id,
  fullName: `${user.lastName} ${user.firstName}`,
  age: user.birthDate ? calculateAge(user.birthDate, Date.now()) : null,
  department: resolveDepartmentName(user.departmentId, departments),
  joinedAt: user.createdAt.toLocaleDateString("ja-JP"),
})

const sortByName = (users: ReadonlyArray<DisplayUser>): DisplayUser[] =>
  users.toSorted((a, b) => a.fullName.localeCompare(b.fullName, "ja"))

// 組み合わせ
function processUserData(
  rawUsers: ReadonlyArray<RawUser>,
  departments: ReadonlyArray<Department>
): DisplayUser[] {
  return sortByName(
    rawUsers
      .filter(isDisplayableUser)
      .map(user => toDisplayUser(user, departments))
  )
}
```

**原則:**
- 目安：1関数は10-15行以内、引数は3つ以内
- 関数名を読めば何をするか分かる状態を目指す
- 「〜して、〜して、〜する」と説明が「〜して」で繋がるなら分割候補
- 各関数が独立してテスト可能であること
- 過度な分割は避ける：1行の関数を無理に抽出する必要はない
