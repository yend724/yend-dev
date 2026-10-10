## 引数が 3 つ以上なら object parameter を検討する

同種の引数が増えるほど、呼び出し位置で意味が読みにくくなり、順序ミスも起きやすい。3 つ以上の引数、または optional 引数を含む場合は object parameter を優先する。

**Bad (位置依存の引数):**

```ts
createReport("weekly", "ja", true, 30)
updateUser(userId, email, displayName, avatarUrl)
```

**Good (意味が明確な object parameter):**

```ts
createReport({
  period: "weekly",
  locale: "ja",
  includeDrafts: true,
  limit: 30,
})

updateUser({
  userId,
  email,
  displayName,
  avatarUrl,
})
```

**例外:**
- 数学関数や配列操作のように、引数の役割が自明で短いもの
- framework / library の既存シグネチャに合わせる必要があるもの
