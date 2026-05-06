## 関数名は動詞から始め、振る舞いを表す

関数名は「何をするか」が分かる動詞で始める。値の種類だけを名付ける名詞的な関数名は避ける。

**Bad:**

```ts
const userData = (id: string) => fetchUser(id)
const validation = (input: string) => input.length > 0
const price = (amount: number) => formatPrice(amount)
```

**Good:**

```ts
const fetchUserData = (id: string) => fetchUser(id)
const validateInput = (input: string) => input.length > 0
const formatPriceLabel = (amount: number) => formatPrice(amount)
```

**原則:**
- getter なら `get`, 取得処理なら `fetch`, 判定なら `is` / `has`, 変換なら `to` / `format` / `build`
- hook だけは React 規約に従って `useXxx` にする
