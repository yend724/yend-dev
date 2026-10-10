## `any` を避け、`unknown` とジェネリクスを優先する

`any` は型検査を無効化し、TypeScript を導入する価値を大きく下げる。外部入力や未確定の値は `unknown` で受け、利用前に型を絞り込む。再利用可能な処理では `any` ではなくジェネリクスを使う。

**Bad (`any` による型崩壊):**

```ts
function parse(data: any) {
  return data.items.map((item: any) => item.id)
}

const first = (list: any[]) => list[0]
```

**Good (`unknown` とジェネリクス):**

```ts
function parse(data: unknown): string[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("items" in data) ||
    !Array.isArray(data.items)
  ) {
    return []
  }

  return data.items
    .filter((item): item is { id: string } => {
      return typeof item === "object" && item !== null && "id" in item && typeof item.id === "string"
    })
    .map((item) => item.id)
}

const first = <T>(list: readonly T[]): T | undefined => list[0]
```

**許容されるケース:**
- どうしても型が表現できない外部ライブラリ境界
- 段階的移行中の一時的な退避

その場合も `TODO` なしで放置せず、影響範囲を最小限に閉じ込める。
