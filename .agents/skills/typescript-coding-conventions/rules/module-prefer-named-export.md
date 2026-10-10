## default export より named export を優先する

named export はリネームや検索がしやすく、import 側でも何を使っているかが明確になる。特に utility、hook、service、型定義では named export を標準とする。

**Bad (default export 前提):**

```ts
export default function formatPrice(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(value)
}
```

```ts
import priceFormatter from "./format-price"
```

**Good (named export):**

```ts
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("ja-JP").format(value)
}
```

```ts
import { formatPrice } from "./format-price"
```

**例外:**
- Next.js の `page.tsx` や `layout.tsx` など、フレームワークが default export を要求する箇所
- 単一責務のエントリポイントで default export が既存規約として固定されている箇所
