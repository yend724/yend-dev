## 変数名は `camelCase` を基本にする

ローカル変数、引数、オブジェクトプロパティ、関数の戻り値を受ける識別子は `camelCase` を使う。snake_case や曖昧な短縮は避ける。

**Bad:**

```ts
const user_name = "Aki"
const res = await fetchUser()
const ITEM_LIST = getItems()
```

**Good:**

```ts
const userName = "Aki"
const userResponse = await fetchUser()
const itemList = getItems()
```

**原則:**
- 3 文字程度でも意味が明確でない略語は避ける
- スコープが狭くても、役割が読める名前を付ける
